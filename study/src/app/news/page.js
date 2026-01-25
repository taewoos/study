'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { AppShell } from '../components/AppShell';
import { isAdmin, getUser, getToken } from '@/utils/auth';

const customerReviews = [
  { quote: '"반복 업무가 사라지니, 팀이 \'중요한 일\'에 집중할 수 있게 됐어요."', meta: '운영팀장' },
  { quote: '"처리 속도는 빨라졌는데 품질은 더 좋아졌습니다. 고객 응대가 달라졌어요."', meta: 'CS 매니저' },
  { quote: '"도입이 어렵지 않았고, 결과가 빨리 보여서 내부 설득이 쉬웠습니다."', meta: '기획팀' },
  { quote: '"문서 흐름이 표준화되면서 누락이 줄었고, 새로 온 인력도 바로 따라오더라고요."', meta: '백오피스 리드' },
  { quote: '"조회→정리→보고까지 걸리던 시간이 짧아지니 의사결정이 빨라졌습니다."', meta: '관리/경영지원' },
  { quote: '"예외 케이스만 사람이 처리하고 대부분은 자동으로 끝나니, 야근이 눈에 띄게 줄었어요."', meta: '운영 담당자' },
  { quote: '"업무별로 맞는 템플릿이 있으니, 결과물이 매번 일정해서 협업이 편해졌습니다."', meta: 'PM' },
  { quote: '"데이터 근거가 같이 남으니까 감사 대응이 훨씬 쉬워졌습니다."', meta: '컴플라이언스' },
  { quote: '"상담부터 구축까지 커뮤니케이션이 명확해서 현업 스트레스가 줄었습니다."', meta: '현업 오너' },
  { quote: '"정책/권한이 적용된 상태로만 답변이 나오니 내부 공유가 훨씬 안전해졌습니다."', meta: '보안/IT' },
  { quote: '"업무 기준이 \'사람\'에서 \'프로세스\'로 바뀌면서 운영이 안정화됐습니다."', meta: '운영리더' },
  { quote: '"작게 시작해서 성과 보고 확장하는 방식이라, 내부 합의가 쉬웠습니다."', meta: '프로덕트' },
];

const testimonialRows = 3;
const getTestimonialRowItems = (rowIndex) => customerReviews.filter((_, idx) => idx % testimonialRows === rowIndex);

export default function NewsPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [pageContent, setPageContent] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [newAchievement, setNewAchievement] = useState({ title: '', date: '', excerpt: '', href: '#', type: 'news' });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const checkAdmin = () => {
      setIsAdminUser(isAdmin());
    };
    
    checkAdmin();
    const handleLoginChange = () => checkAdmin();
    window.addEventListener('loginStatusChange', handleLoginChange);
    window.addEventListener('storage', handleLoginChange);

    const loadContent = async () => {
      try {
        const response = await fetch('/api/company/content');
        if (response.ok) {
          const data = await response.json();
          setPageContent(data);
        }
      } catch (error) {
        console.error('Failed to load content:', error);
      }
    };

    const loadAchievements = async () => {
      try {
        const response = await fetch('/api/company/achievements');
        if (response.ok) {
          const data = await response.json();
          const processedData = data.map(item => ({
            ...item,
            _id: item._id?.toString() || item._id
          }));
          setAchievements(processedData);
        }
      } catch (error) {
        console.error('Failed to load achievements:', error);
      }
    };

    loadContent();
    loadAchievements();

    return () => {
      window.removeEventListener('loginStatusChange', handleLoginChange);
      window.removeEventListener('storage', handleLoginChange);
    };
  }, [isMounted]);

  const handleDeleteAchievement = async (id) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const token = getToken();
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const response = await fetch(`/api/company/achievements?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setAchievements(achievements.filter(a => a._id !== id));
        alert('게시글이 삭제되었습니다.');
      } else {
        alert('게시글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to delete achievement:', error);
      alert('게시글 삭제 중 오류가 발생했습니다.');
    }
  };

  if (!isMounted) {
    return <div>로딩 중...</div>;
  }

  return (
    <AppShell styles={styles} title="News" activeNav="company" headerActions={null}>
      <div className={styles.container}>
        {/* 검증된 성과 섹션 */}
        <div className={styles.trustSection}>
          <div className={styles.trustHeader}>
            {isEditMode && isAdminUser ? (
              <>
                <input
                  type="text"
                  value={pageContent?.trustTitle || '검증된 성과'}
                  onChange={(e) => {
                    const newContent = { ...pageContent, trustTitle: e.target.value };
                    setPageContent(newContent);
                  }}
                  className={styles.editInput}
                  style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}
                />
                <input
                  type="text"
                  value={pageContent?.trustSubtitle || '보도자료, 인증서, 특허로 신뢰를 보여드립니다.'}
                  onChange={(e) => {
                    const newContent = { ...pageContent, trustSubtitle: e.target.value };
                    setPageContent(newContent);
                  }}
                  className={styles.editInput}
                />
              </>
            ) : (
              <>
                <h2 className={styles.trustTitle}>{pageContent?.trustTitle || '검증된 성과'}</h2>
                <p className={styles.trustSubtitle}>
                  {pageContent?.trustSubtitle || '보도자료, 인증서, 특허로 신뢰를 보여드립니다.'}
                </p>
              </>
            )}
            {isAdminUser && (
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  background: isEditMode ? '#ff4444' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {isEditMode ? '편집 종료' : '편집 모드'}
              </button>
            )}
          </div>

          <div className={styles.trustGrid}>
            <div className={styles.newsPanel}>
              <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>News</h3>
                <span className={styles.panelHint}>업데이트/보도자료</span>
                {isAdminUser && isEditMode && (
                  <button
                    onClick={() => {
                      setNewAchievement({ title: '', date: '', excerpt: '', href: '#', type: 'news' });
                      setImagePreview(null);
                      setShowAchievementModal(true);
                    }}
                    style={{
                      marginLeft: 'auto',
                      padding: '0.25rem 0.5rem',
                      background: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    + 추가
                  </button>
                )}
              </div>
              <div className={styles.newsList}>
                {achievements.filter(a => a.type === 'news').sort((a, b) => {
                  const dateDiff = new Date(b.date) - new Date(a.date);
                  if (dateDiff !== 0) return dateDiff;
                  const aCreated = a.createdAt ? new Date(a.createdAt) : new Date(0);
                  const bCreated = b.createdAt ? new Date(b.createdAt) : new Date(0);
                  return bCreated - aCreated;
                }).map((n, idx) => (
                  <div key={n._id || n.title || idx} style={{ position: 'relative' }}>
                    {isAdminUser && isEditMode && (
                      <button
                        onClick={() => handleDeleteAchievement(n._id)}
                        style={{
                          position: 'absolute',
                          top: '0.5rem',
                          right: '0.5rem',
                          background: '#ff4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          zIndex: 10
                        }}
                      >
                        ×
                      </button>
                    )}
                    <a href={n.href} target="_blank" rel="noopener noreferrer" className={styles.newsCard}>
                      <div className={styles.newsTopRow}>
                        <span className={styles.newsDate}>{n.date}</span>
                        <span className={styles.newsArrow}>›</span>
                      </div>
                      <h4 className={styles.newsTitle}>{n.title}</h4>
                      <p className={styles.newsExcerpt}>{n.excerpt}</p>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.credentialPanel}>
              <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>Certificates / Patents</h3>
                <span className={styles.panelHint}>이미지/캡션</span>
                {isAdminUser && isEditMode && (
                  <button
                    onClick={() => {
                      setNewAchievement({ title: '', date: '', excerpt: '', href: '#', type: 'credential' });
                      setImagePreview(null);
                      setShowAchievementModal(true);
                    }}
                    style={{
                      marginLeft: 'auto',
                      padding: '0.25rem 0.5rem',
                      background: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    + 추가
                  </button>
                )}
              </div>
              <div className={styles.credentialGrid}>
                {achievements.filter(a => a.type === 'credential').map((c) => (
                  <div key={c._id || c.title} style={{ position: 'relative' }}>
                    {isAdminUser && isEditMode && (
                      <button
                        onClick={() => handleDeleteAchievement(c._id)}
                        style={{
                          position: 'absolute',
                          top: '0.5rem',
                          right: '0.5rem',
                          background: '#ff4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          zIndex: 10
                        }}
                      >
                        ×
                      </button>
                    )}
                    <div className={styles.credentialCard}>
                      <div className={styles.credentialThumb}>
                        <img src={c.href || '/uploads/aillm.png'} alt={c.title} />
                      </div>
                      <div className={styles.credentialText}>
                        <div className={styles.credentialTitle}>{c.title}</div>
                        <div className={styles.credentialSubtitle}>{c.excerpt}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial 섹션 */}
        <div className={styles.pricingExtra}>
          <section className={styles.pricingExtraSection}>
            <div className={styles.pricingExtraHeader}>
              <p className={styles.pricingExtraEyebrow}>TESTIMONIAL</p>
              <h3 className={styles.pricingExtraTitle}>Customer review</h3>
              <p className={styles.pricingExtraSub}>현장에서 느끼는 변화는 '숫자'보다 먼저 체감됩니다.</p>
            </div>

            <div className={styles.testimonialMarquee} aria-label="Customer reviews marquee">
              {Array.from({ length: testimonialRows }).map((_, rowIdx) => {
                const items = getTestimonialRowItems(rowIdx);
                const direction = rowIdx === 1 ? 'left' : 'right';
                return (
                  <div
                    key={`testimonial-row-${rowIdx}`}
                    className={`${styles.testimonialMarqueeRow} ${
                      direction === 'left' ? styles.testimonialMarqueeRowLeft : styles.testimonialMarqueeRowRight
                    }`}
                  >
                    <div className={styles.testimonialMarqueeTrack}>
                      {[...items, ...items].map((t, idx) => (
                        <figure className={styles.testimonialMarqueeCard} key={`${rowIdx}-${idx}-${t.meta}`}>
                          <blockquote className={styles.testimonialQuote}>{t.quote}</blockquote>
                          <figcaption className={styles.testimonialMeta}>{t.meta}</figcaption>
                        </figure>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
