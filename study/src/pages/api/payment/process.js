import { connectDB } from '@/utils/db';
import { verifyUser } from '@/utils/authServer';

// 실제 결제 처리 API
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = await connectDB();
  if (!client) {
    return res.status(500).json({ error: '데이터베이스 연결에 실패했습니다.' });
  }
  const db = client.db('study');
  const paymentsCollection = db.collection('payments');
  const paymentMethodsCollection = db.collection('payment_methods');
  const usersCollection = db.collection('users');

  try {
    // 사용자 인증 확인
    const userCheck = await verifyUser(req);
    if (!userCheck.authenticated) {
      return res.status(401).json({ error: userCheck.error || '인증이 필요합니다.' });
    }

    const { amount, plan } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: '올바른 결제 금액을 입력해주세요.' });
    }

    // 등록된 카드 확인
    const paymentMethod = await paymentMethodsCollection.findOne({
      userId: userCheck.user.userId || userCheck.user.email
    });

    if (!paymentMethod) {
      return res.status(400).json({ error: '등록된 카드가 없습니다. 먼저 카드를 등록해주세요.' });
    }

    // 실제 결제 처리 (포트원, 토스페이먼츠 등 연동 필요)
    // 여기서는 시뮬레이션으로 처리
    const paymentResult = await processPayment({
      amount,
      cardNumber: paymentMethod.cardNumber,
      userId: userCheck.user.userId || userCheck.user.email,
      plan
    });

    if (!paymentResult.success) {
      return res.status(400).json({ error: paymentResult.error || '결제에 실패했습니다.' });
    }

    // 결제 내역 저장
    const payment = {
      userId: userCheck.user.userId || userCheck.user.email,
      email: userCheck.user.email,
      amount: amount,
      plan: plan,
      status: 'completed',
      paymentMethod: 'card',
      transactionId: paymentResult.transactionId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await paymentsCollection.insertOne(payment);

    // 사용자의 다음 결제일 업데이트 (1개월 후)
    const nextPaymentDate = new Date();
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

    await usersCollection.updateOne(
      { 
        $or: [
          { userId: userCheck.user.userId },
          { email: userCheck.user.email }
        ]
      },
      { 
        $set: { 
          nextPaymentDate: nextPaymentDate,
          lastPaymentDate: new Date(),
          updatedAt: new Date()
        } 
      }
    );

    return res.status(200).json({ 
      message: '결제가 완료되었습니다.',
      payment: payment,
      transactionId: paymentResult.transactionId
    });
  } catch (error) {
    console.error('Payment process error:', error);
    return res.status(500).json({ error: '결제 처리 중 오류가 발생했습니다.' });
  }
}

// 실제 결제 처리 함수 (포트원, 토스페이먼츠 등 연동)
async function processPayment({ amount, cardNumber, userId, plan }) {
  // 실제로는 포트원, 토스페이먼츠 등의 API를 호출해야 합니다
  // 여기서는 시뮬레이션으로 처리
  
  try {
    // 시뮬레이션: 항상 성공
    // 실제 구현 시:
    // 1. 포트원 API 호출
    // 2. 결제 승인 요청
    // 3. 결과 반환
    
    // 예시: 포트원 연동
    // const response = await fetch('https://api.portone.io/payments/v1/payments', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${PORTONE_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     amount: amount,
    //     currency: 'KRW',
    //     orderId: `order_${Date.now()}`,
    //     // ... 기타 결제 정보
    //   })
    // });
    
    // 임시로 성공 처리
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      transactionId: transactionId,
      message: '결제가 완료되었습니다.'
    };
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      error: '결제 처리 중 오류가 발생했습니다.'
    };
  }
}
