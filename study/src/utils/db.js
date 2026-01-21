import { MongoClient } from 'mongodb'

// 외부에서 접속 가능한 MongoDB URL
const url = 'mongodb://carbonomy:carbonomy1!@221.143.229.2:27017/carbonomy?authSource=admin'
const options = {}

let connectDB

if (process.env.NODE_ENV === 'development') {
  if (!global._mongo) {
    global._mongo = new MongoClient(url, options).connect()
  }
  connectDB = global._mongo
} else {
  connectDB = new MongoClient(url, options).connect()
}

export { connectDB }
