'use client';

import styles from './page.module.css';
import { AppShell } from '../components/AppShell';

export default function HomePage() {
  const headerActions = (
    <>
      <button className={styles.headerButton}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
        <span>문의하기</span>
      </button>
      <button className={styles.headerButton}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span>알림 0</span>
      </button>
    </>
  );

  return (
    <AppShell styles={styles} title="MyPage" activeNav="mypage" headerActions={headerActions}>
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
                <div className={styles.paymentStatusHeader}>
                  <div>
                    <span className={styles.paymentPlan}>Enterprise 플랜</span>
                    <div className={styles.paymentPlanDesc}>프리미엄 기능 모두 이용 가능</div>
                  </div>
                  <span className={styles.paymentStatusBadge}>
                    <span className={styles.badgePulse}></span>
                    활성
                  </span>
                </div>
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
                      <span className={styles.paymentValue}>₩500,000</span>
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
                <button className={styles.paymentButton}>
                  <span>결제 관리</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
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
            <div className={styles.rpaProjectsGrid}>
              <div className={styles.rpaProjectCard}>
                <div className={styles.rpaCardLeftBorder}></div>
                <div className={styles.rpaCardContent}>
                  <div className={styles.rpaCardHeader}>
                    <span className={styles.rpaProjectDate}>2025-11-12</span>
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
                  <h3 className={styles.rpaProjectTitle}>세금계산서 수정_erp</h3>
                  <p className={styles.rpaProjectDescription}>업무 관련 자동화 프로젝트입니다.</p>
                  <a href="/rpa/1" className={styles.rpaViewDetailsLink}>자세히 보기 →</a>
                </div>
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
