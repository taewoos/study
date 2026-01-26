import { connectDB } from '@/utils/db';
import { verifyUser } from '@/utils/authServer';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST' && req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 사용자 인증 확인
    const userCheck = await verifyUser(req);
    if (!userCheck.authenticated) {
      return res.status(401).json({ error: userCheck.error || '인증이 필요합니다.' });
    }

    const userId = userCheck.user.userId || userCheck.user.email;
    const client = await connectDB();
    if (!client) {
      return res.status(500).json({ error: '데이터베이스 연결에 실패했습니다.' });
    }
    const db = client.db('study');
    const memosCollection = db.collection('aillm_memos');

    if (req.method === 'GET') {
      // 메모 목록 조회
      const memosData = await memosCollection.findOne({ userId });

      if (!memosData) {
        return res.status(200).json({ memos: [] });
      }

      return res.status(200).json({ memos: memosData.memos || [] });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      // 메모 목록 저장
      const { memos } = req.body;

      const memosData = {
        userId,
        memos: memos || [],
        updatedAt: new Date(),
      };

      await memosCollection.updateOne(
        { userId },
        { $set: memosData },
        { upsert: true }
      );

      return res.status(200).json({ message: '메모가 저장되었습니다.' });
    }
  } catch (error) {
    console.error('Memos API error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}
