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
    const canvasCollection = db.collection('aillm_canvas');

    if (req.method === 'GET') {
      // 캔버스 데이터 조회
      const canvasData = await canvasCollection.findOne({ userId });

      if (!canvasData) {
        return res.status(200).json({
          items: [],
          links: [],
          groups: [],
        });
      }

      return res.status(200).json({
        items: canvasData.items || [],
        links: canvasData.links || [],
        groups: canvasData.groups || [],
      });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      // 캔버스 데이터 저장
      const { items, links, groups } = req.body;

      const canvasData = {
        userId,
        items: items || [],
        links: links || [],
        groups: groups || [],
        updatedAt: new Date(),
      };

      await canvasCollection.updateOne(
        { userId },
        { $set: canvasData },
        { upsert: true }
      );

      return res.status(200).json({ message: '캔버스 데이터가 저장되었습니다.' });
    }
  } catch (error) {
    console.error('Canvas API error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}
