# 결제 시스템 연동 가이드

실제 결제를 처리하기 위해 결제 게이트웨이를 연동해야 합니다. GPT나 Cursor처럼 실제 결제까지 진행하려면 다음 서비스 중 하나를 선택해야 합니다.

## 🎯 추천 결제 서비스

### 1. **포트원 (PortOne)** - 한국 서비스 추천 ⭐
- **장점**: 
  - 한국에서 가장 널리 사용
  - 신용카드, 계좌이체, 가상계좌, 간편결제(토스, 카카오페이, 네이버페이) 모두 지원
  - 간단한 SDK 제공
  - 테스트 환경 제공
- **단점**: 해외 결제는 제한적
- **가격**: 거래 수수료 약 2.5~3.5%
- **문서**: https://developers.portone.io/

### 2. **Stripe** - 글로벌 서비스 추천 ⭐
- **장점**:
  - 전 세계적으로 가장 인기
  - 강력한 API와 문서
  - 구독 결제(Subscription) 기능 우수
  - 다양한 결제 수단 지원
- **단점**: 한국 결제 수단은 제한적 (신용카드 위주)
- **가격**: 거래 수수료 약 2.9% + $0.30
- **문서**: https://stripe.com/docs

### 3. **토스페이먼츠**
- **장점**: 한국 간편결제에 특화
- **단점**: 다른 결제 수단 지원 제한적
- **문서**: https://developers.tosspayments.com/

### 4. **KG이니시스**
- **장점**: 한국 전통적인 PG사
- **단점**: API가 복잡할 수 있음

---

## 🚀 포트원 연동 방법 (한국 서비스 추천)

### 1단계: 포트원 계정 생성 및 설정

1. **포트원 가입**: https://admin.portone.io/
2. **Store ID 발급**: 관리자 콘솔에서 Store ID 확인
3. **채널 키 발급**: 테스트용 채널 키 발급

### 2단계: SDK 설치

```bash
npm install @portone/browser-sdk
```

### 3단계: 환경 변수 설정

`.env.local` 파일에 추가:
```env
NEXT_PUBLIC_PORTONE_STORE_ID=your_store_id
NEXT_PUBLIC_PORTONE_CHANNEL_KEY=your_channel_key
PORTONE_SECRET_KEY=your_secret_key
```

**중요:**
- `NEXT_PUBLIC_PORTONE_STORE_ID`: 포트원 관리자 콘솔의 V2 API 섹션에서 확인한 Store ID
- `NEXT_PUBLIC_PORTONE_CHANNEL_KEY`: 포트원 관리자 콘솔에서 발급받은 채널 키 (테스트용 또는 실서비스용)
- `PORTONE_SECRET_KEY`: 포트원 관리자 콘솔의 V2 API 섹션에서 확인한 API Secret

**채널 키 발급 방법:**
1. 포트원 관리자 콘솔 (https://admin.portone.io/) 로그인
2. 상점 설정 > 채널 관리에서 채널 생성 또는 기존 채널 확인
3. 채널 키 복사하여 환경 변수에 추가

### 4단계: 클라이언트 코드 수정

`/src/app/payment/page.js` 수정:

```javascript
import PortOne from '@portone/browser-sdk/v2';

// 결제 처리 함수 수정
const handlePayment = async () => {
  if (!paymentMethod) {
    alert('먼저 카드를 등록해주세요.');
    return;
  }

  setIsProcessing(true);
  try {
    const token = getToken();
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    // 결제 금액 계산
    let amount = 0;
    if (user?.role === 2) amount = 19000;
    else if (user?.role === 3) amount = 149000;

    // 포트원 결제 요청
    const response = await PortOne.requestPayment({
      storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID,
      channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY,
      paymentId: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderName: `${planInfo.name} 플랜 구독`,
      totalAmount: amount,
      currency: 'CURRENCY_KRW',
      payMethod: 'CARD', // CARD, VIRTUAL_ACCOUNT, TRANSFER 등
      customer: {
        fullName: user.name || user.userId,
        email: user.email,
        phoneNumber: user.phone || '010-0000-0000',
      },
    });

    // 결제 성공 시 서버로 결제 정보 전송
    if (response.code === 'PAYMENT_SUCCESS') {
      const paymentResponse = await fetch('/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: amount,
          plan: user?.role === 2 ? 'starter' : user?.role === 3 ? 'pro' : 'enterprise',
          paymentId: response.paymentId,
          transactionId: response.transactionId,
        }),
      });

      if (paymentResponse.ok) {
        alert('결제가 완료되었습니다.');
        loadPaymentHistory();
        window.location.reload();
      }
    } else {
      alert('결제에 실패했습니다: ' + response.message);
    }
  } catch (error) {
    console.error('Payment error:', error);
    alert('결제 처리 중 오류가 발생했습니다.');
  } finally {
    setIsProcessing(false);
  }
};
```

### 5단계: 서버 API 수정

`/src/pages/api/payment/process.js` 수정:

```javascript
import { connectDB } from '@/utils/db';
import { verifyUser } from '@/utils/authServer';

// 포트원 결제 검증
async function verifyPortOnePayment(paymentId, amount) {
  const PORTONE_SECRET_KEY = process.env.PORTONE_SECRET_KEY;
  
  try {
    const response = await fetch(`https://api.portone.io/payments/v2/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `PortOne ${PORTONE_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    // 결제 검증
    if (data.status === 'PAID' && data.amount.total === amount) {
      return {
        success: true,
        transactionId: data.transactionId,
        paymentId: data.paymentId
      };
    }
    
    return {
      success: false,
      error: '결제 검증 실패'
    };
  } catch (error) {
    console.error('PortOne verification error:', error);
    return {
      success: false,
      error: '결제 검증 중 오류 발생'
    };
  }
}

export default async function handler(req, res) {
  // ... 기존 코드 ...
  
  const { amount, plan, paymentId, transactionId } = req.body;

  // 포트원 결제 검증
  const verification = await verifyPortOnePayment(paymentId, amount);
  
  if (!verification.success) {
    return res.status(400).json({ error: verification.error });
  }

  // 결제 내역 저장
  const payment = {
    userId: userCheck.user.userId || userCheck.user.email,
    email: userCheck.user.email,
    amount: amount,
    plan: plan,
    status: 'completed',
    paymentMethod: 'card',
    paymentId: paymentId,
    transactionId: transactionId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await paymentsCollection.insertOne(payment);
  
  // ... 나머지 코드 ...
}
```

### 6단계: 웹훅 설정 (선택사항)

포트원 관리자 콘솔에서 웹훅 URL 등록:
- URL: `https://yourdomain.com/api/payment/webhook`
- 이벤트: `payment.completed`, `payment.failed`

`/src/pages/api/payment/webhook.js` 생성:

```javascript
import { connectDB } from '@/utils/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const PORTONE_SECRET_KEY = process.env.PORTONE_SECRET_KEY;
  const signature = req.headers['x-portone-signature'];
  
  // 웹훅 서명 검증 (보안)
  // 실제 구현 시 포트원 문서 참조

  const { event, data } = req.body;

  if (event === 'payment.completed') {
    const client = await connectDB();
    const db = client.db('study');
    const paymentsCollection = db.collection('payments');
    
    // 결제 완료 처리
    await paymentsCollection.updateOne(
      { paymentId: data.paymentId },
      { 
        $set: { 
          status: 'completed',
          updatedAt: new Date()
        } 
      }
    );
  }

  return res.status(200).json({ received: true });
}
```

---

## 🌍 Stripe 연동 방법 (글로벌 서비스)

### 1단계: Stripe 계정 생성

1. **Stripe 가입**: https://dashboard.stripe.com/register
2. **API 키 발급**: Dashboard > Developers > API keys

### 2단계: SDK 설치

```bash
npm install stripe @stripe/stripe-js
```

### 3단계: 환경 변수 설정

`.env.local`:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### 4단계: 클라이언트 코드

```javascript
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const handlePayment = async () => {
  const stripe = await stripePromise;
  
  // 결제 세션 생성
  const response = await fetch('/api/payment/create-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({
      amount: amount,
      plan: planInfo.name.toLowerCase()
    })
  });

  const { sessionId } = await response.json();
  
  // Stripe Checkout으로 리다이렉트
  const result = await stripe.redirectToCheckout({ sessionId });
  
  if (result.error) {
    alert(result.error.message);
  }
};
```

### 5단계: 서버 API

`/src/pages/api/payment/create-session.js`:

```javascript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { amount, plan } = req.body;
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'krw',
        product_data: {
          name: `${plan} 플랜`,
        },
        unit_amount: amount,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${req.headers.origin}/payment?success=true`,
    cancel_url: `${req.headers.origin}/payment?canceled=true`,
  });

  res.json({ sessionId: session.id });
}
```

---

## 📋 비교표

| 서비스 | 한국 결제 | 해외 결제 | 구독 결제 | 수수료 | 추천 대상 |
|--------|----------|----------|----------|--------|----------|
| **포트원** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | 2.5~3.5% | 한국 서비스 |
| **Stripe** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 2.9% + $0.30 | 글로벌 서비스 |
| **토스페이먼츠** | ⭐⭐⭐⭐ | ⭐ | ⭐⭐ | 2.5~3.5% | 간편결제 중심 |

---

## 🔒 보안 주의사항

1. **서버에서 금액 검증**: 클라이언트에서 전달한 금액을 그대로 사용하지 말고 서버에서 재계산
2. **웹훅 서명 검증**: 웹훅 요청이 실제 결제 서비스에서 온 것인지 검증
3. **카드 정보 저장 금지**: PCI DSS 규정 준수 (카드 번호 직접 저장 금지)
4. **HTTPS 필수**: 결제 관련 모든 통신은 HTTPS 사용

---

## 🧪 테스트 방법

### 포트원 테스트 카드
포트원 테스트 환경에서는 다음 테스트 카드를 사용할 수 있습니다:

**성공 테스트 카드:**
- 카드번호: `1234-5678-9012-3456`
- 만료일: 미래 날짜 (예: 12/25)
- CVV: 임의의 3자리 (예: 123)
- 카드 비밀번호: 임의의 2자리 (예: 12)

**실패 테스트 카드:**
- 카드번호: `1111-1111-1111-1111` (결제 실패)
- 기타 테스트 카드는 포트원 관리자 콘솔의 테스트 가이드 참조

**참고:** 
- 테스트 환경에서는 실제 결제가 발생하지 않습니다
- 테스트 카드로 결제를 진행하면 항상 성공으로 처리됩니다
- 포트원 관리자 콘솔에서 테스트 결제 내역을 확인할 수 있습니다

### Stripe 테스트 카드
- 카드번호: `4242 4242 4242 4242`
- 만료일: 미래 날짜
- CVV: 임의의 3자리

---

## 📚 추가 리소스

- **포트원 문서**: https://developers.portone.io/
- **Stripe 문서**: https://stripe.com/docs
- **토스페이먼츠 문서**: https://developers.tosspayments.com/

---

## 💡 추천

- **한국 사용자 중심**: **포트원** 추천
- **글로벌 서비스**: **Stripe** 추천
- **둘 다 지원**: 두 서비스 모두 연동 (사용자 선택)
