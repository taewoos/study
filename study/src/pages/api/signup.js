import { connectDB } from '@/utils/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, userId, password, company } = req.body;

    // 필수 필드 검증
    if (!name || !email || !userId || !password || !company) {
      return res.status(400).json({ 
        error: '모든 필드를 입력해주세요.' 
      });
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: '올바른 이메일 형식이 아닙니다.' 
      });
    }

    // 비밀번호 길이 검증 (최소 6자)
    if (password.length < 6) {
      return res.status(400).json({ 
        error: '비밀번호는 최소 6자 이상이어야 합니다.' 
      });
    }

    // 데이터베이스 연결
    const client = await connectDB();
    if (!client) {
      return res.status(500).json({ 
        error: '데이터베이스 연결에 실패했습니다.' 
      });
    }
    const db = client.db('study');
    const usersCollection = db.collection('users');

    // 이메일 중복 확인
    const existingEmail = await usersCollection.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ 
        error: '이미 사용 중인 이메일입니다.' 
      });
    }

    // 사용자 ID 중복 확인
    const existingUserId = await usersCollection.findOne({ userId });
    if (existingUserId) {
      return res.status(400).json({ 
        error: '이미 사용 중인 아이디입니다.' 
      });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 데이터 생성
    // 권한 등급: 0=관리자, 1=일반유저, 2=starter, 3=pro, 4=enterprise
    const userData = {
      name,
      email,
      userId,
      password: hashedPassword,
      company,
      role: 1, // 기본값: 일반유저
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 데이터베이스에 저장
    const result = await usersCollection.insertOne(userData);

    if (result.insertedId) {
      return res.status(201).json({ 
        message: '회원가입이 완료되었습니다.',
        userId: result.insertedId 
      });
    } else {
      return res.status(500).json({ 
        error: '회원가입 중 오류가 발생했습니다.' 
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ 
      error: '서버 오류가 발생했습니다.' 
    });
  }
}
