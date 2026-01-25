const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// MongoDB 연결 정보
const url = 'mongodb://carbonomy:carbonomy1!@221.143.229.2:27017/study?authSource=admin';

async function createAdmin() {
  let client;
  
  try {
    // MongoDB 연결
    client = new MongoClient(url);
    await client.connect();
    console.log('데이터베이스에 연결되었습니다.');

    const db = client.db('study');
    const usersCollection = db.collection('users');

    // 관리자 계정 정보
    const adminData = {
      name: '관리자',
      email: 'admin@customai.com',
      userId: 'admin',
      password: await bcrypt.hash('admin123!', 10),
      company: 'Custom AI',
      role: 0, // 관리자 권한
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 기존 관리자 계정 확인
    const existingAdmin = await usersCollection.findOne({
      $or: [
        { email: adminData.email },
        { userId: adminData.userId },
        { role: 0 }
      ]
    });

    if (existingAdmin) {
      console.log('이미 관리자 계정이 존재합니다:');
      console.log({
        email: existingAdmin.email,
        userId: existingAdmin.userId,
        role: existingAdmin.role,
        name: existingAdmin.name
      });
      
      if (existingAdmin.role !== 0) {
        // 기존 계정을 관리자로 업데이트
        await usersCollection.updateOne(
          { _id: existingAdmin._id },
          { $set: { role: 0 } }
        );
        console.log('기존 계정이 관리자 권한으로 업데이트되었습니다.');
      }
      return;
    }

    // 관리자 계정 생성
    const result = await usersCollection.insertOne(adminData);

    if (result.insertedId) {
      console.log('\n✅ 관리자 계정이 성공적으로 생성되었습니다!\n');
      console.log('로그인 정보:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('이메일/아이디: admin@customai.com 또는 admin');
      console.log('비밀번호: admin123!');
      console.log('권한: 관리자 (role: 0)');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('⚠️  보안을 위해 로그인 후 비밀번호를 변경하세요!');
    } else {
      console.error('관리자 계정 생성에 실패했습니다.');
    }
  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('\n데이터베이스 연결이 종료되었습니다.');
    }
  }
}

// 스크립트 실행
createAdmin();
