import { connectDB } from '@/utils/db';
import { verifyUser } from '@/utils/authServer';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST' && req.method !== 'DELETE') {
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
    const templatesCollection = db.collection('aillm_templates');

    if (req.method === 'GET') {
      // 사용자 템플릿 목록 조회
      const templates = await templatesCollection
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray();

      // MongoDB _id를 id로 변환
      const formatted = templates.map((template) => ({
        id: template._id.toString(),
        name: template.name,
        positions: template.positions,
        memos: template.memos || [],
        createdAt: template.createdAt,
        isSample: false, // 사용자 템플릿은 샘플이 아님
      }));

      return res.status(200).json(formatted);
    }

    if (req.method === 'POST') {
      // 새 템플릿 생성
      const { name, positions, memos } = req.body;

      if (!name || !positions) {
        return res.status(400).json({ error: '템플릿 이름과 위치 정보가 필요합니다.' });
      }

      const template = {
        userId,
        name: name.trim(),
        positions,
        memos: memos || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await templatesCollection.insertOne(template);
      return res.status(201).json({
        id: result.insertedId.toString(),
        name: template.name,
        positions: template.positions,
        memos: template.memos,
        createdAt: template.createdAt,
        isSample: false,
      });
    }

    if (req.method === 'DELETE') {
      // 템플릿 삭제
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: '템플릿 ID가 필요합니다.' });
      }

      const result = await templatesCollection.deleteOne({
        _id: new ObjectId(id),
        userId,
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: '템플릿을 찾을 수 없습니다.' });
      }

      return res.status(200).json({ message: '템플릿이 삭제되었습니다.' });
    }
  } catch (error) {
    console.error('Templates API error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}
