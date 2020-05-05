
const mongoose = require('mongoose')
const mongooseLeanMethods = require('../')

const { MONGO_URI = 'mongodb://localhost:27017/mongooseLeanMethods' } = process.env

const methodName = 'test'

function validateRegular(user) {
  expect(user[methodName]).toBeUndefined()
}

function validate(user) {
  expect(user[methodName]).toBeDefined()
}

describe('mongooseLeanMethods', () => {
  let schema
  let User
  let userId

  beforeAll(async done => {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

    schema = new mongoose.Schema({}, { collection: 'users' })
    schema.method(methodName, function() {})
    schema.plugin(mongooseLeanMethods)
    User = mongoose.model('User', schema)
    // ensure clean database
    await User.deleteMany()
    const user = await User.create({})
    userId = user._id
    done()
  })

  test('should work with findOne()', async done => {
    validateRegular(await User.findOne().lean())
    validate(await User.findOne().lean({methods: true}))
    done()
  })

  it('should work with find()', async done => {
    const regularRes = await User.find().lean()
    validateRegular(regularRes[0])
    const res = await User.find().lean({methods: true})
    validate(res[0])
    done()
  })

  it('should work with findById()', async done => {
    validateRegular(await User.findById(userId).lean())
    validate(await User.findById(userId).lean({methods: true}))
    done()
  })

  afterAll(async done => {
    await User.deleteMany()
    await mongoose.disconnect()
    done()
  })
})