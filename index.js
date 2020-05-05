const mpath = require('mpath')

module.exports = function mongooseLeanMethods(schema) {
  const fn = attachMethodsMiddleware(schema)
  schema.pre('find', function () {
    if (typeof this.map === 'function') {
      this.map((res) => {
        fn.call(this, res)
        return res
      })
    } else {
      this.options.transform = (res) => {
        fn.call(this, res)
        return res
      }
    }
  })

  schema.post('find', fn)
  schema.post('findOne', fn)
  schema.post('findOneAndUpdate', fn)
  schema.post('findOneAndRemove', fn)
  schema.post('findOneAndDelete', fn)
}

function attachMethodsMiddleware(schema) {
  return function (res) {
    attachMethods.call(this, schema, res)
  }
}

function attachMethods(schema, res) {
  if (res == null) {
    return
  }

  if (this._mongooseOptions.lean && this._mongooseOptions.lean.methods) {
    
    const methods = {}
    for (const key in schema.methods) {
      if (key === 'initializeTimestamps') continue
      methods[key] = schema.methods[key]
    }

    if (Array.isArray(res)) {
      const len = res.length
      for (let i = 0; i < len; ++i) {
        res[i] = attachMethodsToDoc(res[i], methods)
      }
    } else {
      res = attachMethodsToDoc(res, methods)
    }

    for (let i = 0; i < schema.childSchemas.length; ++i) {
      const _path = schema.childSchemas[i].model.path
      const _schema = schema.childSchemas[i].schema
      const _doc = mpath.get(_path, res)
      if (_doc == null) {
        continue
      }
      attachMethods.call(this, _schema, _doc)
    }

    return res
  } else {
    return res
  }
}

function attachMethodsToDoc(doc, methods) {
  if (Object.keys(methods).length === 0) {
    return doc
  }
  for (const key in methods) {
    doc[key] = methods[key]
  }
  return doc
}