import jwt from 'jsonwebtoken';
import { connectDB } from '@/utils/db';

// JWT 시크릿 키 (환경 변수에서 가져오거나 기본값 사용)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// 서버 측 사용자 인증 및 권한 확인 (JWT 토큰 기반)
export async function verifyUser(req) {
  try {
    // Authorization 헤더에서 JWT 토큰 가져오기
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { authenticated: false, error: '인증 토큰이 없습니다.' };
    }

    const token = authHeader.substring(7); // 'Bearer ' 제거

    if (!token) {
      return { authenticated: false, error: '인증 토큰이 없습니다.' };
    }

    // JWT 토큰 검증
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return { authenticated: false, error: '토큰이 만료되었습니다.' };
      } else if (error.name === 'JsonWebTokenError') {
        return { authenticated: false, error: '유효하지 않은 토큰입니다.' };
      }
      return { authenticated: false, error: '토큰 검증 중 오류가 발생했습니다.' };
    }

    // 데이터베이스에서 사용자 정보 확인 (토큰이 조작되었을 수 있으므로)
    const client = await connectDB();
    if (!client) {
      return { authenticated: false, error: '데이터베이스 연결에 실패했습니다.' };
    }

    const db = client.db('study');
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({
      $or: [
        { userId: decoded.userId },
        { email: decoded.email },
        { _id: decoded._id }
      ]
    });

    if (!user) {
      return { authenticated: false, error: '사용자를 찾을 수 없습니다.' };
    }

    // 토큰의 role과 데이터베이스의 role이 일치하는지 확인
    if (decoded.role !== user.role) {
      return { authenticated: false, error: '권한 정보가 일치하지 않습니다.' };
    }

    return {
      authenticated: true,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        userId: user.userId,
        role: user.role !== undefined ? user.role : 1,
      }
    };
  } catch (error) {
    console.error('User verification error:', error);
    return { authenticated: false, error: '인증 중 오류가 발생했습니다.' };
  }
}

// 관리자 권한 확인
export async function verifyAdmin(req) {
  const verification = await verifyUser(req);
  
  if (!verification.authenticated) {
    return { isAdmin: false, error: verification.error };
  }

  if (verification.user.role !== 0) {
    return { isAdmin: false, error: '관리자 권한이 필요합니다.' };
  }

  return { isAdmin: true, user: verification.user };
}
