import { connectDB } from '@/utils/db';

// 회사 페이지 콘텐츠 저장/불러오기 API
export default async function handler(req, res) {
  const client = await connectDB();
  if (!client) {
    return res.status(500).json({ error: '데이터베이스 연결에 실패했습니다.' });
  }
  const db = client.db('study');
  const contentCollection = db.collection('company_content');

  if (req.method === 'GET') {
    try {
      const content = await contentCollection.findOne({ type: 'main' });
      return res.status(200).json(content?.data || {});
    } catch (error) {
      console.error('Content fetch error:', error);
      return res.status(500).json({ error: '콘텐츠를 불러오는데 실패했습니다.' });
    }
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      const { data } = req.body;

      // 관리자 권한 확인 (간단한 검증, 실제로는 JWT 토큰 검증 필요)
      // 여기서는 클라이언트에서 role을 확인하므로 서버에서도 검증하는 것이 좋습니다.

      const result = await contentCollection.updateOne(
        { type: 'main' },
        { 
          $set: { 
            type: 'main',
            data: data,
            updatedAt: new Date()
          }
        },
        { upsert: true }
      );

      return res.status(200).json({ 
        message: '콘텐츠가 저장되었습니다.',
        success: true
      });
    } catch (error) {
      console.error('Content save error:', error);
      return res.status(500).json({ error: '콘텐츠 저장에 실패했습니다.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
