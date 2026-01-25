'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { AppShell } from '../components/AppShell';
import { getUser, getToken } from '@/utils/auth';

export default function PaymentPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
    cardPassword: ''
  });
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadPaymentInfo();
    loadPaymentHistory();
  }, [router]);

  const loadPaymentInfo = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch('/api/payment/method', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentMethod(data);
      }
    } catch (error) {
      console.error('Failed to load payment method:', error);
    }
  };

  const loadPaymentHistory = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch('/api/payment/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentHistory(data);
      }
    } catch (error) {
      console.error('Failed to load payment history:', error);
    }
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.replace(/(.{4})/g, '$1 ').trim();
    setCardInfo({ ...cardInfo, cardNumber: formatted });
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setCardInfo({ ...cardInfo, expiryDate: value });
  };

  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) value = value.slice(0, 3);
    setCardInfo({ ...cardInfo, cvv: value });
  };

  const handleCardPasswordChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) value = value.slice(0, 2);
    setCardInfo({ ...cardInfo, cardPassword: value });
  };

  const handleSaveCard = async () => {
    if (!cardInfo.cardNumber || !cardInfo.expiryDate || !cardInfo.cvv || !cardInfo.cardHolder) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    setIsProcessing(true);
    try {
      const token = getToken();
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const response = await fetch('/api/payment/method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cardNumber: cardInfo.cardNumber.replace(/\s/g, ''),
          expiryDate: cardInfo.expiryDate,
          cvv: cardInfo.cvv,
          cardHolder: cardInfo.cardHolder,
          // 실제로는 카드 정보를 암호화하여 저장해야 합니다
        }),
      });

      if (response.ok) {
        alert('카드가 등록되었습니다.');
        setShowCardForm(false);
        setCardInfo({
          cardNumber: '',
          expiryDate: '',
          cvv: '',
          cardHolder: '',
          cardPassword: ''
        });
        loadPaymentInfo();
      } else {
        const errorData = await response.json().catch(() => ({ error: '카드 등록에 실패했습니다.' }));
        alert(errorData.error || '카드 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to save card:', error);
      alert('카드 등록 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert('먼저 카드를 등록해주세요.');
      return;
    }

    if (!confirm('결제를 진행하시겠습니까?')) {
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
      else if (user?.role === 4) {
        alert('Enterprise 플랜은 문의가 필요합니다.');
        setIsProcessing(false);
        return;
      }

      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: amount,
          plan: user?.role === 2 ? 'starter' : user?.role === 3 ? 'pro' : 'enterprise'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('결제가 완료되었습니다.');
        loadPaymentHistory();
        // 결제 성공 후 페이지 새로고침 또는 상태 업데이트
        window.location.reload();
      } else {
        const errorData = await response.json().catch(() => ({ error: '결제에 실패했습니다.' }));
        alert(errorData.error || '결제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to process payment:', error);
      alert('결제 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteCard = async () => {
    if (!confirm('등록된 카드를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch('/api/payment/method', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('카드가 삭제되었습니다.');
        setPaymentMethod(null);
        loadPaymentInfo();
      } else {
        alert('카드 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to delete card:', error);
      alert('카드 삭제 중 오류가 발생했습니다.');
    }
  };

  if (!isMounted) {
    return <div>로딩 중...</div>;
  }

  const getPlanInfo = () => {
    if (!user) return null;
    const role = user.role;
    if (role === 2) return { name: 'Starter', amount: 19000 };
    if (role === 3) return { name: 'Pro', amount: 149000 };
    if (role === 4) return { name: 'Enterprise', amount: 0 };
    return null;
  };

  const planInfo = getPlanInfo();

  return (
    <AppShell styles={styles} title="결제 관리" activeNav="mypage">
      <div className={styles.paymentContainer}>
        {/* 뒤로가기 버튼 */}
        <button 
          onClick={() => router.push('/mypage')}
          className={styles.backButton}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span>마이페이지로 돌아가기</span>
        </button>

        {/* 결제 정보 섹션 */}
        <section className={styles.paymentSection}>
          <h2 className={styles.sectionTitle}>결제 정보</h2>
          
          {planInfo ? (
            <div className={styles.planCard}>
              <div className={styles.planInfo}>
                <h3 className={styles.planName}>{planInfo.name} 플랜</h3>
                <div className={styles.planAmount}>
                  {planInfo.amount > 0 ? `₩${planInfo.amount.toLocaleString()}/월` : '문의'}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.planCard}>
              <p>플랜을 선택해주세요.</p>
            </div>
          )}

          {/* 등록된 카드 정보 */}
          {paymentMethod && !showCardForm && (
            <div className={styles.cardInfoCard}>
              <div className={styles.cardInfoHeader}>
                <h3>등록된 카드</h3>
                <button 
                  onClick={handleDeleteCard}
                  className={styles.deleteButton}
                >
                  삭제
                </button>
              </div>
              <div className={styles.cardDisplay}>
                <div className={styles.cardNumber}>
                  **** **** **** {paymentMethod.last4 || '1234'}
                </div>
                <div className={styles.cardDetails}>
                  <span>{paymentMethod.cardHolder || '카드 소유자'}</span>
                  <span>{paymentMethod.expiryDate || 'MM/YY'}</span>
                </div>
              </div>
            </div>
          )}

          {/* 카드 등록 폼 */}
          {showCardForm && (
            <div className={styles.cardFormCard}>
              <h3>신용카드 등록</h3>
              <div className={styles.formGroup}>
                <label>카드 번호</label>
                <input
                  type="text"
                  value={cardInfo.cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className={styles.cardInput}
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>만료일 (MM/YY)</label>
                  <input
                    type="text"
                    value={cardInfo.expiryDate}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    className={styles.cardInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>CVV</label>
                  <input
                    type="text"
                    value={cardInfo.cvv}
                    onChange={handleCvvChange}
                    placeholder="123"
                    maxLength={3}
                    className={styles.cardInput}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>카드 소유자 이름</label>
                <input
                  type="text"
                  value={cardInfo.cardHolder}
                  onChange={(e) => setCardInfo({ ...cardInfo, cardHolder: e.target.value })}
                  placeholder="홍길동"
                  className={styles.cardInput}
                />
              </div>
              <div className={styles.formActions}>
                <button
                  onClick={handleSaveCard}
                  disabled={isProcessing}
                  className={styles.saveButton}
                >
                  {isProcessing ? '처리 중...' : '카드 등록'}
                </button>
                <button
                  onClick={() => {
                    setShowCardForm(false);
                    setCardInfo({
                      cardNumber: '',
                      expiryDate: '',
                      cvv: '',
                      cardHolder: '',
                      cardPassword: ''
                    });
                  }}
                  className={styles.cancelButton}
                >
                  취소
                </button>
              </div>
            </div>
          )}

          {/* 카드 등록/결제 버튼 */}
          {!showCardForm && (
            <div className={styles.actionButtons}>
              {!paymentMethod ? (
                <button
                  onClick={() => setShowCardForm(true)}
                  className={styles.primaryButton}
                >
                  카드 등록
                </button>
              ) : planInfo && planInfo.amount > 0 ? (
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className={styles.primaryButton}
                >
                  {isProcessing ? '결제 처리 중...' : '결제하기'}
                </button>
              ) : null}
            </div>
          )}
        </section>

        {/* 결제 내역 섹션 */}
        <section className={styles.paymentSection}>
          <h2 className={styles.sectionTitle}>결제 내역</h2>
          {paymentHistory.length > 0 ? (
            <div className={styles.historyList}>
              {paymentHistory.map((payment, idx) => (
                <div key={idx} className={styles.historyItem}>
                  <div className={styles.historyInfo}>
                    <div className={styles.historyPlan}>{payment.plan || '플랜'}</div>
                    <div className={styles.historyDate}>
                      {new Date(payment.createdAt).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                  <div className={styles.historyAmount}>
                    ₩{payment.amount?.toLocaleString() || '0'}
                  </div>
                  <div className={styles.historyStatus}>
                    <span className={`${styles.statusBadge} ${payment.status === 'completed' ? styles.statusSuccess : ''}`}>
                      {payment.status === 'completed' ? '완료' : payment.status || '대기'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>결제 내역이 없습니다.</p>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
