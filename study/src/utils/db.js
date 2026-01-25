import { MongoClient } from 'mongodb'

// 외부에서 접속 가능한 MongoDB URL
const url = 'mongodb://carbonomy:carbonomy1!@221.143.229.2:27017/study?authSource=admin'
const options = {}

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // 개발 환경에서는 global 변수를 사용하여 재사용
  if (!global._mongoClientPromise) {
    client = new MongoClient(url, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // 프로덕션 환경
  client = new MongoClient(url, options);
  clientPromise = client.connect();
}

export { clientPromise as connectDB };
