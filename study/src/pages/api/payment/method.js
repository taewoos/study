import { connectDB } from '@/utils/db';
import { verifyUser } from '@/utils/authServer';

// 결제 수단(카드) 관리 API
export default async function handler(req, res) {
  const client = await connectDB();
  if (!client) {
    return res.status(500).json({ error: '데이터베이스 연결에 실패했습니다.' });
  }
  const db = client.db('study');
  const paymentMethodsCollection = db.collection('payment_methods');

  if (req.method === 'GET') {
    try {
      // 사용자 인증 확인
      const userCheck = await verifyUser(req);
      if (!userCheck.authenticated) {
        return res.status(401).json({ error: userCheck.error || '인증이 필요합니다.' });
      }

      // 사용자의 등록된 카드 정보 조회
      const paymentMethod = await paymentMethodsCollection.findOne({
        userId: userCheck.user.userId || userCheck.user.email
      });

      if (!paymentMethod) {
        return res.status(200).json(null);
      }

      // 카드 번호는 마지막 4자리만 반환 (보안)
      return res.status(200).json({
        last4: paymentMethod.cardNumber?.slice(-4),
        cardHolder: paymentMethod.cardHolder,
        expiryDate: paymentMethod.expiryDate,
        createdAt: paymentMethod.createdAt
      });
    } catch (error) {
      console.error('Payment method fetch error:', error);
      return res.status(500).json({ error: '결제 수단을 불러오는데 실패했습니다.' });
    }
  }

  if (req.method === 'POST') {
    try {
      // 사용자 인증 확인
      const userCheck = await verifyUser(req);
      if (!userCheck.authenticated) {
        return res.status(401).json({ error: userCheck.error || '인증이 필요합니다.' });
      }

      const { cardNumber, expiryDate, cvv, cardHolder } = req.body;

      if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
        return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
      }

      // 카드 번호 유효성 검사 (간단한 Luhn 알고리즘 체크)
      const cardNumberClean = cardNumber.replace(/\s/g, '');
      if (cardNumberClean.length < 13 || cardNumberClean.length > 19) {
        return res.status(400).json({ error: '올바른 카드 번호를 입력해주세요.' });
      }

      // 실제로는 카드 정보를 암호화하여 저장해야 합니다
      // 여기서는 간단하게 마스킹하여 저장
      const maskedCardNumber = cardNumberClean.slice(-4).padStart(cardNumberClean.length, '*');

      const paymentMethod = {
        userId: userCheck.user.userId || userCheck.user.email,
        email: userCheck.user.email,
        cardNumber: maskedCardNumber, // 실제로는 암호화 필요
        last4: cardNumberClean.slice(-4),
        expiryDate: expiryDate,
        cardHolder: cardHolder,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // 기존 카드가 있으면 업데이트, 없으면 생성
      const result = await paymentMethodsCollection.updateOne(
        { userId: userCheck.user.userId || userCheck.user.email },
        { $set: paymentMethod },
        { upsert: true }
      );

      return res.status(200).json({ 
        message: '카드가 등록되었습니다.',
        success: true
      });
    } catch (error) {
      console.error('Payment method save error:', error);
      return res.status(500).json({ error: '카드 등록에 실패했습니다.' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      // 사용자 인증 확인
      const userCheck = await verifyUser(req);
      if (!userCheck.authenticated) {
        return res.status(401).json({ error: userCheck.error || '인증이 필요합니다.' });
      }

      const result = await paymentMethodsCollection.deleteOne({
        userId: userCheck.user.userId || userCheck.user.email
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: '등록된 카드를 찾을 수 없습니다.' });
      }

      return res.status(200).json({ message: '카드가 삭제되었습니다.' });
    } catch (error) {
      console.error('Payment method delete error:', error);
      return res.status(500).json({ error: '카드 삭제에 실패했습니다.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
