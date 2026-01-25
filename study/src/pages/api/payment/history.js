import { connectDB } from '@/utils/db';
import { verifyUser } from '@/utils/authServer';

// 결제 내역 조회 API
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = await connectDB();
  if (!client) {
    return res.status(500).json({ error: '데이터베이스 연결에 실패했습니다.' });
  }
  const db = client.db('study');
  const paymentsCollection = db.collection('payments');

  try {
    // 사용자 인증 확인
    const userCheck = await verifyUser(req);
    if (!userCheck.authenticated) {
      return res.status(401).json({ error: userCheck.error || '인증이 필요합니다.' });
    }

    // 사용자의 결제 내역 조회
    const payments = await paymentsCollection
      .find({
        $or: [
          { userId: userCheck.user.userId },
          { email: userCheck.user.email }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return res.status(200).json(payments);
  } catch (error) {
    console.error('Payment history fetch error:', error);
    return res.status(500).json({ error: '결제 내역을 불러오는데 실패했습니다.' });
  }
}
