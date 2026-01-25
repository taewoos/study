const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// MongoDB 연결 정보
const url = 'mongodb://carbonomy:carbonomy1!@221.143.229.2:27017/study?authSource=admin';

async function createTestUsers() {
  let client;
  
  try {
    // MongoDB 연결
    client = new MongoClient(url);
    await client.connect();
    console.log('데이터베이스에 연결되었습니다.');

    const db = client.db('study');
    const usersCollection = db.collection('users');

    // 테스트 계정 정보
    const testUsers = [
      {
        name: '테스트 유저 1',
        email: 'test1@test.com',
        userId: 'test1',
        password: await bcrypt.hash('test123!', 10),
        company: '테스트 회사',
        role: 1, // 일반 유저
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: '테스트 유저 2',
        email: 'test2@test.com',
        userId: 'test2',
        password: await bcrypt.hash('test123!', 10),
        company: '테스트 회사',
        role: 2, // Starter
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: '테스트 유저 3',
        email: 'test3@test.com',
        userId: 'test3',
        password: await bcrypt.hash('test123!', 10),
        company: '테스트 회사',
        role: 3, // Pro
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: '테스트 유저 4',
        email: 'test4@test.com',
        userId: 'test4',
        password: await bcrypt.hash('test123!', 10),
        company: '테스트 회사',
        role: 4, // Enterprise
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // 각 계정 생성
    for (const userData of testUsers) {
      // 기존 계정 확인
      const existingUser = await usersCollection.findOne({
        $or: [
          { email: userData.email },
          { userId: userData.userId }
        ]
      });

      if (existingUser) {
        // 기존 계정 업데이트
        await usersCollection.updateOne(
          { _id: existingUser._id },
          { 
            $set: {
              ...userData,
              updatedAt: new Date()
            }
          }
        );
        console.log(`계정 업데이트됨: ${userData.userId} (role: ${userData.role})`);
      } else {
        // 새 계정 생성
        const result = await usersCollection.insertOne(userData);
        if (result.insertedId) {
          console.log(`계정 생성됨: ${userData.userId} (role: ${userData.role})`);
        }
      }
    }

    console.log('\n모든 테스트 계정이 준비되었습니다.');
    console.log('로그인 정보:');
    console.log('  test1 (role 1 - 일반 유저): test1 / test123!');
    console.log('  test2 (role 2 - Starter): test2 / test123!');
    console.log('  test3 (role 3 - Pro): test3 / test123!');
    console.log('  test4 (role 4 - Enterprise): test4 / test123!');
    
  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('데이터베이스 연결이 종료되었습니다.');
    }
  }
}

createTestUsers();
