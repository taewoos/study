import { connectDB } from '@/utils/db';
import { verifyUser } from '@/utils/authServer';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = await connectDB();
    if (!client) {
      return res.status(500).json({ error: '데이터베이스 연결에 실패했습니다.' });
    }
    const db = client.db('study');
    const noticesCollection = db.collection('notices');

    if (req.method === 'GET') {
      // 공지사항 조회 (공용)
      const notices = await noticesCollection
        .find({})
        .sort({ isImportant: -1, createdAt: -1 })
        .toArray();

      const formatted = notices.map((notice) => ({
        id: notice._id.toString(),
        title: notice.title,
        content: notice.content,
        isImportant: notice.isImportant || false,
        createdAt: notice.createdAt,
      }));

      return res.status(200).json(formatted);
    }

    if (req.method === 'POST') {
      // 관리자만 공지사항 생성 가능 (인증 확인)
      const userCheck = await verifyUser(req);
      if (!userCheck.authenticated || userCheck.user.role !== 0) {
        return res.status(403).json({ error: '관리자 권한이 필요합니다.' });
      }

      const { title, content, isImportant } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: '제목과 내용을 입력해주세요.' });
      }

      const notice = {
        title: title.trim(),
        content: content.trim(),
        isImportant: isImportant || false,
        createdAt: new Date(),
      };

      const result = await noticesCollection.insertOne(notice);
      return res.status(201).json({
        id: result.insertedId.toString(),
        title: notice.title,
        content: notice.content,
        isImportant: notice.isImportant,
        createdAt: notice.createdAt,
      });
    }
  } catch (error) {
    console.error('Notices API error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}
