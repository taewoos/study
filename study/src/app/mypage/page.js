'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { AppShell } from '../components/AppShell';
import { getUser, getToken } from '@/utils/auth';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [rpaProjects, setRpaProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    const currentUser = getUser();
    setUser(currentUser);
    
    // 로그인 상태 변경 감지
    const handleLoginChange = () => {
      setUser(getUser());
    };
    window.addEventListener('loginStatusChange', handleLoginChange);
    window.addEventListener('storage', handleLoginChange);

    // RPA 프로젝트 목록 불러오기
    if (currentUser) {
      fetchRpaProjects();
    }

    return () => {
      window.removeEventListener('loginStatusChange', handleLoginChange);
      window.removeEventListener('storage', handleLoginChange);
    };
  }, []);

  const fetchRpaProjects = async () => {
    try {
      setIsLoadingProjects(true);
      const token = getToken();
      if (!token) {
        setIsLoadingProjects(false);
        return;
      }

      const response = await fetch('/api/rpa/projects', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // 최대 3개만 표시
        setRpaProjects(data.slice(0, 3));
      } else {
        setRpaProjects([]);
      }
    } catch (error) {
      console.error('RPA 프로젝트 로드 오류:', error);
      setRpaProjects([]);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  // role에 따른 결제 정보 설정
  const getPaymentInfo = () => {
    if (!user) return null;
    
    const role = user.role;
    
    if (role === 0) {
      // 관리자
      return {
        plan: '관리자',
        description: '관리자입니다',
        status: '관리자',
        showPaymentInfo: false,
        showPaymentButton: false
      };
    } else if (role === 1) {
      // 일반 유저 - 결제 유도
      return {
        plan: '결제 필요',
        description: '플랜을 선택하여 결제하세요',
        status: '미결제',
        showPaymentInfo: false,
        showPaymentButton: true,
        buttonText: '결제하기'
      };
    } else if (role === 2) {
      // Starter
      return {
        plan: 'Starter 플랜',
        description: '개인/소규모 팀을 위한 시작 플랜',
        status: '활성',
        showPaymentInfo: true,
        amount: '₩19,000',
        showPaymentButton: true,
        buttonText: '결제 관리'
      };
    } else if (role === 3) {
      // Pro
      return {
        plan: 'Pro 플랜',
        description: '업무 자동화를 본격적으로 확장',
        status: '활성',
        showPaymentInfo: true,
        amount: '₩49,900',
        showPaymentButton: true,
        buttonText: '결제 관리'
      };
    } else if (role === 4) {
      // Premium
      return {
        plan: 'Premium 플랜',
        description: '프리미엄 기능 모두 이용 가능',
        status: '활성',
        showPaymentInfo: true,
        amount: '₩149,000',
        showPaymentButton: true,
        buttonText: '결제 관리'
      };
    } else if (role === 5) {
      // Enterprise
      return {
        plan: 'Enterprise 플랜',
        description: '맞춤형 솔루션',
        status: '활성',
        showPaymentInfo: true,
        amount: '문의',
        showPaymentButton: true,
        buttonText: '결제 관리'
      };
    }
    
    return null;
  };

  const paymentInfo = getPaymentInfo();

  return (
    <AppShell styles={styles} title="MyPage" activeNav="mypage" headerActions={null}>
      {/* Payment Status Section */}
          <section className={`${styles.section} ${styles.paymentSection}`}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>결제 상태</h2>
                <p className={styles.sectionSubtitle}>구독 및 결제 정보를 확인하세요</p>
              </div>
              <a href="/payment" className={`${styles.viewAllLink} ${styles.paymentViewAllLink}`}>결제 내역 보기 →</a>
            </div>
            <div className={styles.paymentCard}>
              <div className={styles.paymentCardGlow}></div>
              <div className={styles.paymentStatus}>
                {isMounted && paymentInfo ? (
                  <>
                    <div className={styles.paymentStatusHeader}>
                      <div>
                        <span className={styles.paymentPlan}>{paymentInfo.plan}</span>
                        <div className={styles.paymentPlanDesc}>{paymentInfo.description}</div>
                      </div>
                      {paymentInfo.status && (
                        <span className={styles.paymentStatusBadge}>
                          {paymentInfo.status !== '관리자' && <span className={styles.badgePulse}></span>}
                          {paymentInfo.status}
                        </span>
                      )}
                    </div>
                    {paymentInfo.showPaymentInfo ? (
                      <div className={styles.paymentInfo}>
                        <div className={styles.paymentInfoItem}>
                          <div className={styles.paymentInfoIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <polyline points="12 6 12 12 16 14"/>
                            </svg>
                          </div>
                          <div className={styles.paymentInfoText}>
                            <span className={styles.paymentLabel}>다음 결제일</span>
                            <span className={styles.paymentValue}>2025년 2월 15일</span>
                          </div>
                        </div>
                        <div className={styles.paymentInfoItem}>
                          <div className={styles.paymentInfoIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="12" y1="1" x2="12" y2="23"/>
                              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                            </svg>
                          </div>
                          <div className={styles.paymentInfoText}>
                            <span className={styles.paymentLabel}>결제 금액</span>
                            <span className={styles.paymentValue}>{paymentInfo.amount}</span>
                          </div>
                        </div>
                        <div className={styles.paymentInfoItem}>
                          <div className={styles.paymentInfoIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                              <line x1="1" y1="10" x2="23" y2="10"/>
                            </svg>
                          </div>
                          <div className={styles.paymentInfoText}>
                            <span className={styles.paymentLabel}>결제 방법</span>
                            <span className={styles.paymentValue}>신용카드 (****1234)</span>
                          </div>
                        </div>
                      </div>
                    ) : user?.role === 1 ? (
                      <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <p style={{ marginBottom: '1rem', color: '#666' }}>
                          플랜을 선택하여 결제하시면 더 많은 기능을 이용하실 수 있습니다.
                        </p>
                      </div>
                    ) : null}
                    {paymentInfo.showPaymentButton && (
                      <button 
                      className={styles.paymentButton}
                      onClick={() => window.location.href = '/payment'}
                      >
                        <span>{paymentInfo.buttonText || '결제 관리'}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </button>
                    )}
                  </>
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <p>로딩 중...</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* AI Services Section */}
          <section className={styles.section}>
            <div>
              <h2 className={styles.sectionTitle}>AI 기반 서비스</h2>
              <p className={styles.sectionSubtitle}>인공지능으로 업무의 새로운 경험을</p>
            </div>
            <div className={styles.aiServicesGrid}>
              {/* Chatbot Card */}
              <div className={`${styles.serviceCard} ${styles.serviceCardChatbot}`}>
                <div className={styles.serviceCardPattern}></div>
                <div className={styles.serviceCardContent}>
                  <div className={styles.serviceCardHeader}>
                    <div className={`${styles.serviceIcon} ${styles.serviceIconChatbot}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className={styles.serviceCardTitle}>AI-LLM 대화방</h3>
                      <div className={styles.serviceCardStatus}>
                        <span className={styles.statusDot}></span>
                        <span>실시간 대화 가능</span>
                      </div>
                    </div>
                  </div>
                  <p className={styles.serviceCardDescription}>
                    자연어 처리 기반의 AI와 대화하고 업무 관련 도움을 받으세요.
                  </p>
                  <div className={styles.recentSection}>
                    <h4 className={styles.recentTitle}>최근 대화방</h4>
                    <div className={styles.recentItem}>
                      <div className={styles.recentItemIndicator}></div>
                      <div className={styles.recentItemContent}>
                        <p className={styles.recentItemTitle}>워크빌더 db 연결방법 알려줘</p>
                        <p className={styles.recentItemDesc}>Let's produce answer. 워크빌더에서 DB에 ...</p>
                        <div className={styles.recentItemMeta}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                          <span>1월 6일</span>
                          <span>→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* OCR Card */}
              <div className={`${styles.serviceCard} ${styles.serviceCardOcr}`}>
                <div className={styles.serviceCardPattern}></div>
                <div className={styles.serviceCardContent}>
                  <div className={styles.serviceCardHeader}>
                    <div className={`${styles.serviceIcon} ${styles.serviceIconOcr}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className={styles.serviceCardTitle}>AI-OCR 문서 목록</h3>
                      <div className={styles.serviceCardStatus}>
                        <span className={styles.statusDot}></span>
                        <span>고정밀 인식</span>
                      </div>
                    </div>
                  </div>
                  <p className={styles.serviceCardDescription}>
                    문서 이미지를 업로드하고 텍스트를 자동으로 추출하세요.
                  </p>
                  <div className={styles.recentSection}>
                    <h4 className={styles.recentTitle}>최근 OCR 작업</h4>
                    <div className={styles.recentItem}>
                      <div className={styles.ocrTag}>IMG</div>
                      <div className={styles.ocrItemContent}>
                        <div className={styles.ocrItemHeader}>
                          <span className={styles.ocrDate}>12월 10일</span>
                          <span className={styles.ocrFileName}>image.png</span>
                        </div>
                        <p className={styles.ocrItemText}>[ {`{ "partNumber": "", "itemCategory": ...`}</p>
                        <div className={styles.recentItemMeta}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                          <span>12월 10일</span>
                          <span>→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* RPA Projects Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>RPA 프로젝트</h2>
                <p className={styles.sectionSubtitle}>자동화로 업무를 혁신하세요</p>
              </div>
              <a href="/rpa" className={styles.viewAllLink}>전체 프로젝트 보기 →</a>
            </div>
            {isLoadingProjects ? (
              <div className={styles.rpaProjectsGrid}>
                <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                  프로젝트를 불러오는 중...
                </div>
              </div>
            ) : rpaProjects.length > 0 ? (
              <div className={styles.rpaProjectsGrid}>
                {rpaProjects.map((project) => (
                  <div 
                    key={project.id} 
                    className={styles.rpaProjectCard}
                    onClick={() => router.push(`/rpa/${project.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={styles.rpaCardLeftBorder}></div>
                    <div className={styles.rpaCardContent}>
                      <div className={styles.rpaCardHeader}>
                        <span className={styles.rpaProjectDate}>{project.date}</span>
                        <div className={styles.rpaCardIcon}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10 9 9 9 8 9"/>
                          </svg>
                        </div>
                      </div>
                      <h3 className={styles.rpaProjectTitle}>{project.title}</h3>
                      <p className={styles.rpaProjectDescription}>{project.description}</p>
                      <a 
                        href={`/rpa/${project.id}`} 
                        className={styles.rpaViewDetailsLink}
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(`/rpa/${project.id}`);
                        }}
                      >
                        자세히 보기 →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.rpaProjectsGrid}>
                <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                  <p>등록된 프로젝트가 없습니다.</p>
                  <a href="/rpa" style={{ color: '#4A90E2', textDecoration: 'none', marginTop: '1rem', display: 'inline-block' }}>
                    프로젝트 등록하기 →
                  </a>
                </div>
              </div>
            )}
          </section>

          {/* Ad Banner Section */}
          <section className={styles.section}>
            <div className={styles.adBanner}>
              <div className={styles.adBannerContent}>
                <h3 className={styles.adBannerTitle}>새로운 AI 기능을 만나보세요</h3>
                <p className={styles.adBannerDescription}>
                  최신 AI 기술로 업무 효율성을 극대화하세요. 지금 바로 시작하세요!
                </p>
                <button className={styles.adBannerButton}>자세히 알아보기 →</button>
              </div>
              <div className={styles.adBannerImage}>
                <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="200" height="120" fill="#f0f0f0"/>
                  <circle cx="100" cy="60" r="30" fill="#4A90E2" opacity="0.3"/>
                  <path d="M80 60 L95 75 L120 45" stroke="#4A90E2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </section>
    </AppShell>
  );
}
