# Deprecated
This package already not maintenanced (my health reason).  
This package is so tiny, if you replace this package, you can copy only index.js.
(I'm waiting anyone take over this library.)  

# mongoose-lean-methods

Attach methods to the results of mongoose queries when using `.lean()`. Highly inspired by mongoose-lean-virtuals and mongoose-lean-defaults.  
Note: schema.methods attaching affect to slow performance when find documents, avoid create much methods in schema is better.

Install

```
npm install --save mongoose-lean-methods
```

or

```
yarn add mongoose-lean-methods
```

# Usage

```
const mongooseLeanMethods = require('mongoose-lean-methods')

const schema = new mongoose.Schema({
  name: String,
})

schema.methods.showName = async function() {
  console.log(this.name)
}
// or
schema.method('showName', async function(){
  console.log(this.name)
})

schema.plugin(mongooseLeanMethods)

// You must pass `methods: true` to `.lean()`
const doc = await Model.findOne().lean({ methods: true })
doc.showname()
```

# Licence
MIT
