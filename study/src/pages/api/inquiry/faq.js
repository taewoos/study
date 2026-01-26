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
    const faqCollection = db.collection('faq');

    if (req.method === 'GET') {
      // 빠른 Q&A 조회 (공용)
      const faqs = await faqCollection
        .find({})
        .sort({ order: 1, createdAt: -1 })
        .toArray();

      const formatted = faqs.map((faq) => ({
        id: faq._id.toString(),
        question: faq.question,
        answer: faq.answer,
        category: faq.category || 'general',
        order: faq.order || 0,
      }));

      return res.status(200).json(formatted);
    }

    if (req.method === 'POST') {
      // 관리자만 FAQ 생성 가능 (인증 확인)
      const userCheck = await verifyUser(req);
      if (!userCheck.authenticated || userCheck.user.role !== 0) {
        return res.status(403).json({ error: '관리자 권한이 필요합니다.' });
      }

      const { question, answer, category, order } = req.body;

      if (!question || !answer) {
        return res.status(400).json({ error: '질문과 답변을 입력해주세요.' });
      }

      const faq = {
        question: question.trim(),
        answer: answer.trim(),
        category: category || 'general',
        order: order || 0,
        createdAt: new Date(),
      };

      const result = await faqCollection.insertOne(faq);
      return res.status(201).json({
        id: result.insertedId.toString(),
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
      });
    }
  } catch (error) {
    console.error('FAQ API error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}
