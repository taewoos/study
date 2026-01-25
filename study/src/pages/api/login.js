import { connectDB } from '@/utils/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// JWT 시크릿 키 (환경 변수에서 가져오거나 기본값 사용)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, password } = req.body;

    // 필수 필드 검증
    if (!userId || !password) {
      return res.status(400).json({ 
        error: '아이디와 비밀번호를 입력해주세요.' 
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

    // 사용자 찾기 (이메일 또는 userId로 검색)
    const user = await usersCollection.findOne({
      $or: [
        { email: userId },
        { userId: userId }
      ]
    });

    if (!user) {
      return res.status(401).json({ 
        error: '아이디 또는 비밀번호가 올바르지 않습니다.' 
      });
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: '아이디 또는 비밀번호가 올바르지 않습니다.' 
      });
    }

    // JWT 토큰 생성
    const tokenPayload = {
      _id: user._id.toString(),
      userId: user.userId,
      email: user.email,
      role: user.role !== undefined ? user.role : 1,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: '7d', // 7일 후 만료
    });

    // 로그인 성공 - 사용자 정보 반환 (비밀번호 제외)
    const userData = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      userId: user.userId,
      company: user.company,
      role: user.role !== undefined ? user.role : 1, // 권한 등급: 0=관리자, 1=일반유저, 2=starter, 3=pro, 4=enterprise
      createdAt: user.createdAt,
    };

    return res.status(200).json({ 
      message: '로그인 성공',
      user: userData,
      token: token // JWT 토큰 반환
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      error: '서버 오류가 발생했습니다.' 
    });
  }
}
