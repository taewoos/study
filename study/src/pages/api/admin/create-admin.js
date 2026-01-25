import { connectDB } from '@/utils/db';
import bcrypt from 'bcryptjs';

// 관리자 계정 생성 API
// 주의: 프로덕션 환경에서는 보안을 강화해야 합니다 (인증 토큰, IP 제한 등)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, userId, password, company } = req.body;

    // 기본값 설정 (필드가 없으면 기본값 사용)
    const adminData = {
      name: name || '관리자',
      email: email || 'admin@customai.com',
      userId: userId || 'admin',
      password: password || 'admin123!',
      company: company || 'Custom AI',
      role: 0, // 관리자 권한
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 필수 필드 검증
    if (!adminData.email || !adminData.userId || !adminData.password) {
      return res.status(400).json({ 
        error: '이메일, 아이디, 비밀번호는 필수입니다.' 
      });
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminData.email)) {
      return res.status(400).json({ 
        error: '올바른 이메일 형식이 아닙니다.' 
      });
    }

    // 비밀번호 길이 검증 (최소 6자)
    if (adminData.password.length < 6) {
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
    const existingEmail = await usersCollection.findOne({ email: adminData.email });
    if (existingEmail) {
      return res.status(400).json({ 
        error: '이미 사용 중인 이메일입니다.',
        existingUser: {
          email: existingEmail.email,
          userId: existingEmail.userId,
          role: existingEmail.role
        }
      });
    }

    // 사용자 ID 중복 확인
    const existingUserId = await usersCollection.findOne({ userId: adminData.userId });
    if (existingUserId) {
      return res.status(400).json({ 
        error: '이미 사용 중인 아이디입니다.',
        existingUser: {
          email: existingUserId.email,
          userId: existingUserId.userId,
          role: existingUserId.role
        }
      });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // 관리자 데이터 생성
    const userData = {
      ...adminData,
      password: hashedPassword,
    };

    // 데이터베이스에 저장
    const result = await usersCollection.insertOne(userData);

    if (result.insertedId) {
      return res.status(201).json({ 
        message: '관리자 계정이 생성되었습니다.',
        user: {
          _id: result.insertedId.toString(),
          name: userData.name,
          email: userData.email,
          userId: userData.userId,
          company: userData.company,
          role: userData.role,
        },
        loginInfo: {
          userId: userData.userId,
          email: userData.email,
          password: adminData.password, // 원본 비밀번호 반환 (한 번만 표시)
        }
      });
    } else {
      return res.status(500).json({ 
        error: '관리자 계정 생성 중 오류가 발생했습니다.' 
      });
    }
  } catch (error) {
    console.error('Create admin error:', error);
    return res.status(500).json({ 
      error: '서버 오류가 발생했습니다.' 
    });
  }
}
