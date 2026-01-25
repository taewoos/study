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
  const [selectedPaymentType, setSelectedPaymentType] = useState('bank_transfer'); // 'card' or 'bank_transfer'
  const [showBankTransferForm, setShowBankTransferForm] = useState(false);
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [bankTransferInfo, setBankTransferInfo] = useState({
    depositorName: '', // 입금자명
    depositDate: '', // 입금일
    depositAmount: '', // 입금금액
    bankName: '' // 은행명
  });
  
  // 입금 계좌 정보 (환경 변수 또는 하드코딩)
  const bankAccountInfo = {
    bank: process.env.NEXT_PUBLIC_BANK_NAME || '국민은행',
    accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT || '123-456-789012',
    accountHolder: process.env.NEXT_PUBLIC_BANK_HOLDER || '(주)스터디',
  };
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    
    // 약간의 지연 후 결제 내역 로드 (토큰이 준비될 시간 확보)
    const timer = setTimeout(() => {
      loadPaymentHistory();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [router]);

  const loadPaymentHistory = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.log('토큰이 없어 결제 내역을 불러올 수 없습니다.');
        return;
      }

      const response = await fetch('/api/payment/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentHistory(data);
      } else if (response.status === 401) {
        // 인증 실패 시 토큰 제거하고 로그인 페이지로 리다이렉트
        console.warn('인증이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      } else {
        console.error('결제 내역 로드 실패:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to load payment history:', error);
    }
  };

  const handlePayment = () => {
    // 신용카드 선택 시 준비중 메시지
    if (selectedPaymentType === 'card') {
      alert('신용카드 결제는 준비중입니다.');
      return;
    }
    
    // 무통장 입금인 경우 계좌 정보 표시 및 입금 정보 입력 폼 표시
    if (selectedPaymentType === 'bank_transfer') {
      setShowAccountInfo(true);
      setShowBankTransferForm(true);
    }
  };

  const handleBankTransferSubmit = async () => {
    if (!bankTransferInfo.depositorName || !bankTransferInfo.depositDate || !bankTransferInfo.depositAmount) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    setIsProcessing(true);
    try {
      const token = getToken();
      if (!token) {
        alert('로그인이 필요합니다.');
        setIsProcessing(false);
        return;
      }

      // 결제 금액 계산
      let amount = 0;
      let planName = '';
      if (user?.role === 2) {
        amount = 19000;
        planName = 'Starter';
      } else if (user?.role === 3) {
        amount = 49900;
        planName = 'Pro';
      } else if (user?.role === 4) {
        amount = 149000;
        planName = 'Premium';
      } else if (user?.role === 5) {
        amount = 0;
        planName = 'Enterprise';
      } else {
        alert('플랜을 먼저 선택해주세요.');
        setIsProcessing(false);
        return;
      }

      // 고유한 paymentId 생성
      const paymentId = `bank_transfer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // 서버에 입금 대기 상태로 저장
      const serverResponse = await fetch('/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: amount,
          plan: user?.role === 2 ? 'starter' : user?.role === 3 ? 'pro' : user?.role === 4 ? 'premium' : 'enterprise',
          paymentId: paymentId,
          transactionId: paymentId,
          paymentType: 'bank_transfer',
          status: 'pending', // 입금 대기 상태 (관리자 확인 필요)
          bankTransferInfo: bankTransferInfo,
        }),
      });

      if (serverResponse.ok) {
        alert('입금 정보가 제출되었습니다.\n관리자 확인 후 플랜이 활성화됩니다.');
        setShowBankTransferForm(false);
        setShowAccountInfo(false);
        setBankTransferInfo({
          depositorName: '',
          depositDate: '',
          depositAmount: '',
          bankName: ''
        });
        loadPaymentHistory();
        window.location.reload();
      } else {
        const errorData = await serverResponse.json().catch(() => ({ error: '서버 처리에 실패했습니다.' }));
        alert(errorData.error || '서버 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('Bank transfer submit error:', error);
      alert('입금 정보 제출 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };


  const handleSelectPlan = async (planRole) => {
    try {
      const token = getToken();
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const response = await fetch('/api/user/plan', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: planRole }),
      });

      if (response.ok) {
        const updatedUser = { ...user, role: planRole };
        setUser(updatedUser);
        // localStorage도 업데이트
        const currentUser = getUser();
        if (currentUser) {
          localStorage.setItem('user', JSON.stringify({ ...currentUser, role: planRole }));
        }
        setShowPlanModal(false);
        alert('플랜이 선택되었습니다.');
      } else {
        const errorData = await response.json().catch(() => ({ error: '플랜 선택에 실패했습니다.' }));
        alert(errorData.error || '플랜 선택에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to select plan:', error);
      alert('플랜 선택 중 오류가 발생했습니다.');
    }
  };

  const plans = [
    { role: 2, name: 'Starter', amount: 19000, description: '기본 기능 제공' },
    { role: 3, name: 'Pro', amount: 49900, description: '고급 기능 제공' },
    { role: 4, name: 'Premium', amount: 149000, description: '프리미엄 기능 제공' },
    { role: 5, name: 'Enterprise', amount: 0, description: '맞춤형 솔루션' },
  ];

  if (!isMounted) {
    return <div>로딩 중...</div>;
  }

  const getPlanInfo = () => {
    if (!user) return null;
    const role = user.role;
    if (role === 2) return { name: 'Starter', amount: 19000 };
    if (role === 3) return { name: 'Pro', amount: 49900 };
    if (role === 4) return { name: 'Premium', amount: 149000 };
    if (role === 5) return { name: 'Enterprise', amount: 0 };
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
          <div className={styles.paymentInfoHeader}>
            <h2 className={styles.sectionTitle}>결제 정보</h2>
          </div>
          
          {planInfo ? (
            <div 
              className={styles.planCard}
              onClick={() => setShowPlanModal(true)}
              style={{ cursor: 'pointer' }}
              title="플랜 변경"
            >
              <div className={styles.planInfo}>
                <h3 className={styles.planName}>{planInfo.name} 플랜</h3>
                <div className={styles.planAmount}>
                  {planInfo.amount > 0 ? `₩${planInfo.amount.toLocaleString()}/월` : '문의'}
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 'auto' }}>
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          ) : (
            <div 
              className={styles.planCardSelectable}
              onClick={() => setShowPlanModal(true)}
            >
              <p>플랜을 선택해주세요.</p>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          )}

          {/* 입금 계좌 정보 표시 */}
          {showAccountInfo && (
            <div className={styles.virtualAccountCard}>
              <h3>입금 계좌 정보</h3>
              <div className={styles.virtualAccountInfo}>
                <div className={styles.accountRow}>
                  <span className={styles.accountLabel}>은행:</span>
                  <span className={styles.accountValue}>{bankAccountInfo.bank}</span>
                </div>
                <div className={styles.accountRow}>
                  <span className={styles.accountLabel}>계좌번호:</span>
                  <span className={styles.accountValue}>{bankAccountInfo.accountNumber}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(bankAccountInfo.accountNumber);
                      alert('계좌번호가 복사되었습니다.');
                    }}
                    className={styles.copyButton}
                  >
                    복사
                  </button>
                </div>
                <div className={styles.accountRow}>
                  <span className={styles.accountLabel}>예금주:</span>
                  <span className={styles.accountValue}>{bankAccountInfo.accountHolder}</span>
                </div>
                <div className={styles.accountNotice}>
                  <p>⚠️ 위 계좌로 정확한 금액을 입금해주세요.</p>
                  <p style={{ color: 'red' }}>⚠️ 입금자명은 회원가입 시 입력한 이름과 동일해야 합니다.</p>
                  <p>입금 후 아래 정보를 입력해주세요.</p>
                </div>
              </div>
            </div>
          )}

          {/* 무통장 입금 정보 입력 폼 */}
          {showBankTransferForm && (
            <div className={styles.cardFormCard}>
              <h3>무통장 입금 정보</h3>
              <div className={styles.accountNotice}>
                <p>⚠️ 입금 후 아래 정보를 입력해주세요.</p>
                <p>관리자 확인 후 플랜이 활성화됩니다.</p>
              </div>
              <div className={styles.formGroup}>
                <label>입금자명 *</label>
                <input
                  type="text"
                  value={bankTransferInfo.depositorName}
                  onChange={(e) => setBankTransferInfo({ ...bankTransferInfo, depositorName: e.target.value })}
                  placeholder="홍길동"
                  className={styles.cardInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label>입금일 *</label>
                <input
                  type="date"
                  value={bankTransferInfo.depositDate}
                  onChange={(e) => setBankTransferInfo({ ...bankTransferInfo, depositDate: e.target.value })}
                  className={styles.cardInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label>입금금액 *</label>
                <input
                  type="number"
                  value={bankTransferInfo.depositAmount}
                  onChange={(e) => setBankTransferInfo({ ...bankTransferInfo, depositAmount: e.target.value })}
                  placeholder={planInfo?.amount?.toLocaleString() || '0'}
                  className={styles.cardInput}
                />
                <p className={styles.helperText}>예상 금액: ₩{planInfo?.amount?.toLocaleString() || '0'}</p>
              </div>
              <div className={styles.formGroup}>
                <label>은행명</label>
                <input
                  type="text"
                  value={bankTransferInfo.bankName}
                  onChange={(e) => setBankTransferInfo({ ...bankTransferInfo, bankName: e.target.value })}
                  placeholder="예: 국민은행, 신한은행"
                  className={styles.cardInput}
                />
              </div>
              <div className={styles.formActions}>
                <button
                  onClick={handleBankTransferSubmit}
                  disabled={isProcessing || !bankTransferInfo.depositorName || !bankTransferInfo.depositDate || !bankTransferInfo.depositAmount}
                  className={styles.saveButton}
                >
                  {isProcessing ? '처리 중...' : '입금 정보 제출'}
                </button>
                <button
                  onClick={() => {
                    setShowBankTransferForm(false);
                    setShowAccountInfo(false);
                    setBankTransferInfo({
                      depositorName: '',
                      depositDate: '',
                      depositAmount: '',
                      bankName: '',
                      accountNumber: '',
                      memo: ''
                    });
                  }}
                  className={styles.cancelButton}
                >
                  취소
                </button>
              </div>
            </div>
          )}

          {/* 결제 방식 선택 */}
          {!showBankTransferForm && planInfo && planInfo.amount > 0 && (
            <div className={styles.paymentTypeSection}>
              <h3 className={styles.paymentTypeTitle}>결제 방식 선택</h3>
              <div className={styles.paymentTypeOptions}>
                <label className={styles.paymentTypeOption}>
                  <input
                    type="radio"
                    name="paymentType"
                    value="card"
                    checked={selectedPaymentType === 'card'}
                    onChange={(e) => setSelectedPaymentType(e.target.value)}
                  />
                  <span>신용카드</span>
                </label>
                <label className={styles.paymentTypeOption}>
                  <input
                    type="radio"
                    name="paymentType"
                    value="bank_transfer"
                    checked={selectedPaymentType === 'bank_transfer'}
                    onChange={(e) => setSelectedPaymentType(e.target.value)}
                  />
                  <span>무통장 입금</span>
                </label>
              </div>
              {selectedPaymentType === 'card' && (
                <div className={styles.paymentNotice}>
                  <p>⚠️ 신용카드 결제는 준비중입니다.</p>
                </div>
              )}
            </div>
          )}

          {/* 결제 버튼 */}
          {!showBankTransferForm && planInfo && planInfo.amount > 0 && (
            <div className={styles.actionButtons}>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className={styles.primaryButton}
              >
                결제하기
              </button>
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

        {/* 플랜 선택 모달 */}
        {showPlanModal && (
          <div className={styles.modalOverlay} onClick={() => setShowPlanModal(false)}>
            <div className={styles.planModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>플랜 선택</h3>
                <button 
                  className={styles.modalCloseButton}
                  onClick={() => setShowPlanModal(false)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div className={styles.planOptions}>
                {plans.map((plan) => (
                  <div 
                    key={plan.role} 
                    className={styles.planOption}
                    onClick={() => handleSelectPlan(plan.role)}
                  >
                    <div className={styles.planOptionHeader}>
                      <h4 className={styles.planOptionName}>{plan.name}</h4>
                      <div className={styles.planOptionAmount}>
                        {plan.amount > 0 ? `₩${plan.amount.toLocaleString()}/월` : '문의'}
                      </div>
                    </div>
                    <p className={styles.planOptionDescription}>{plan.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
