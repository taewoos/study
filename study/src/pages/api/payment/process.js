import { connectDB } from '@/utils/db';
import { verifyUser } from '@/utils/authServer';

// 포트원 결제 검증 함수
async function verifyPortOnePayment(paymentId, amount) {
  const PORTONE_SECRET_KEY = process.env.PORTONE_SECRET_KEY;
  
  if (!PORTONE_SECRET_KEY) {
    console.warn('PORTONE_SECRET_KEY가 설정되지 않았습니다. 결제 검증을 건너뜁니다.');
    return {
      success: true,
      transactionId: paymentId,
      paymentId: paymentId,
      warning: '결제 검증이 건너뛰어졌습니다. (환경 변수 미설정)'
    };
  }

  try {
    const response = await fetch(`https://api.portone.io/payments/v2/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `PortOne ${PORTONE_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('포트원 API 응답 오류:', response.status, response.statusText);
      return {
        success: false,
        error: '결제 검증 API 호출 실패'
      };
    }

    const data = await response.json();
    
    // 결제 검증
    if (data.status === 'PAID' && data.amount.total === amount) {
      return {
        success: true,
        transactionId: data.transactionId || paymentId,
        paymentId: data.paymentId || paymentId
      };
    }
    
    return {
      success: false,
      error: '결제 검증 실패: 상태 또는 금액이 일치하지 않습니다.'
    };
  } catch (error) {
    console.error('PortOne verification error:', error);
    return {
      success: false,
      error: '결제 검증 중 오류 발생: ' + error.message
    };
  }
}

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

    const { amount, plan, paymentId, transactionId, paymentType, status, virtualAccount, bankTransferInfo } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: '올바른 결제 금액을 입력해주세요.' });
    }

    if (!paymentId) {
      return res.status(400).json({ error: '결제 ID가 필요합니다.' });
    }

    const isBankTransfer = paymentType === 'bank_transfer';
    const paymentStatus = status || (isBankTransfer ? 'pending' : 'completed');

    // 무통장 입금이 아닌 경우에만 포트원 결제 검증
    if (!isBankTransfer) {
      const verification = await verifyPortOnePayment(paymentId, amount);
      
      if (!verification.success) {
        return res.status(400).json({ error: verification.error || '결제 검증에 실패했습니다.' });
      }
    }

    // 결제 내역 저장
    const payment = {
      userId: userCheck.user.userId || userCheck.user.email,
      email: userCheck.user.email,
      amount: amount,
      plan: plan,
      status: paymentStatus,
      paymentMethod: isBankTransfer ? 'bank_transfer' : 'card',
      paymentType: paymentType || 'card',
      paymentId: paymentId,
      transactionId: transactionId || paymentId,
      virtualAccount: virtualAccount || null,
      bankTransferInfo: bankTransferInfo || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await paymentsCollection.insertOne(payment);

    // 결제 완료된 경우에만 사용자의 다음 결제일 업데이트 (1개월 후)
    if (paymentStatus === 'completed') {
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
    }

    return res.status(200).json({ 
      message: '결제가 완료되었습니다.',
      payment: payment,
      transactionId: verification.transactionId || transactionId,
      paymentId: verification.paymentId || paymentId
    });
  } catch (error) {
    console.error('Payment process error:', error);
    return res.status(500).json({ error: '결제 처리 중 오류가 발생했습니다.' });
  }
}
