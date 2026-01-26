import { connectDB } from '@/utils/db';
import { verifyUser } from '@/utils/authServer';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
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
    const inquiriesCollection = db.collection('inquiries');

    if (req.method === 'GET') {
      // 사용자 문의 내역 조회
      const inquiries = await inquiriesCollection
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray();

      // MongoDB _id를 id로 변환
      const formatted = inquiries.map((inquiry) => ({
        id: inquiry._id.toString(),
        title: inquiry.title,
        content: inquiry.content,
        answer: inquiry.answer || null,
        status: inquiry.status || 'pending', // pending, answered
        createdAt: inquiry.createdAt,
        answeredAt: inquiry.answeredAt || null,
      }));

      return res.status(200).json(formatted);
    }

    if (req.method === 'POST') {
      // 새 문의 생성
      const { title, content } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: '제목과 내용을 입력해주세요.' });
      }

      const inquiry = {
        userId,
        title: title.trim(),
        content: content.trim(),
        status: 'pending',
        answer: null,
        createdAt: new Date(),
        answeredAt: null,
      };

      const result = await inquiriesCollection.insertOne(inquiry);
      return res.status(201).json({
        id: result.insertedId.toString(),
        title: inquiry.title,
        content: inquiry.content,
        status: inquiry.status,
        createdAt: inquiry.createdAt,
      });
    }
  } catch (error) {
    console.error('Inquiries API error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}
