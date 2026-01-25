import { connectDB } from '@/utils/db';
import { verifyUser } from '@/utils/authServer';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 사용자 인증 확인
    const userCheck = await verifyUser(req);
    if (!userCheck.authenticated) {
      return res.status(401).json({ error: userCheck.error || '인증이 필요합니다.' });
    }

    const { role } = req.body;

    // role 유효성 검사 (0: 관리자, 1: 결제안한 유저, 2: 스타터, 3: 프로, 4: 프리미엄, 5: 엔터프라이즈)
    if (role === undefined || ![1, 2, 3, 4, 5].includes(role)) {
      return res.status(400).json({ error: '유효한 플랜을 선택해주세요.' });
    }

    // 데이터베이스 연결
    const client = await connectDB();
    if (!client) {
      return res.status(500).json({ error: '데이터베이스 연결에 실패했습니다.' });
    }
    const db = client.db('study');
    const usersCollection = db.collection('users');

    // 사용자 role 업데이트
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userCheck.user._id) },
      { 
        $set: { 
          role: role,
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    return res.status(200).json({ 
      message: '플랜이 업데이트되었습니다.',
      role: role
    });
  } catch (error) {
    console.error('Plan update error:', error);
    return res.status(500).json({ error: '플랜 업데이트 중 오류가 발생했습니다.' });
  }
}
