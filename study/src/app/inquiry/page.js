'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { AppShell } from '../components/AppShell';
import { LoginModal } from '../components/LoginModal';
import { getUser, getToken } from '@/utils/auth';

export default function InquiryPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // 문의 내역 상태
  const [inquiries, setInquiries] = useState([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [newInquiry, setNewInquiry] = useState({ title: '', content: '' });
  
  // 빠른 Q&A 상태
  const [faqs, setFaqs] = useState([]);
  const [isLoadingFaqs, setIsLoadingFaqs] = useState(true);
  const [expandedFaqId, setExpandedFaqId] = useState(null);
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  
  // 공지사항 상태
  const [notices, setNotices] = useState([]);
  const [isLoadingNotices, setIsLoadingNotices] = useState(true);
  const [expandedNoticeId, setExpandedNoticeId] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    const token = getToken();
    const currentUser = getUser();
    
    if (!token || !currentUser) {
      setShowLoginModal(true);
      return;
    }
    
    setUser(currentUser);
    
    // 데이터 로드
    loadInquiries();
    loadFaqs();
    loadNotices();
    
    // 로그인 상태 변경 감지
    const handleLoginChange = () => {
      const newToken = getToken();
      const newUser = getUser();
      if (!newToken || !newUser) {
        setShowLoginModal(true);
        setUser(null);
      } else {
        setUser(newUser);
        loadInquiries();
      }
    };
    window.addEventListener('loginStatusChange', handleLoginChange);
    window.addEventListener('storage', handleLoginChange);

    return () => {
      window.removeEventListener('loginStatusChange', handleLoginChange);
      window.removeEventListener('storage', handleLoginChange);
    };
  }, []);

  const loadInquiries = async () => {
    try {
      setIsLoadingInquiries(true);
      const token = getToken();
      if (!token) {
        setIsLoadingInquiries(false);
        return;
      }

      const response = await fetch('/api/inquiry/inquiries', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInquiries(data);
      } else {
        setInquiries([]);
      }
    } catch (error) {
      console.error('Failed to load inquiries:', error);
      setInquiries([]);
    } finally {
      setIsLoadingInquiries(false);
    }
  };

  const loadFaqs = async () => {
    try {
      setIsLoadingFaqs(true);
      const response = await fetch('/api/inquiry/faq');

      if (response.ok) {
        const data = await response.json();
        setFaqs(data);
      } else {
        setFaqs([]);
      }
    } catch (error) {
      console.error('Failed to load FAQs:', error);
      setFaqs([]);
    } finally {
      setIsLoadingFaqs(false);
    }
  };

  const loadNotices = async () => {
    try {
      setIsLoadingNotices(true);
      const response = await fetch('/api/inquiry/notices');

      if (response.ok) {
        const data = await response.json();
        setNotices(data);
      } else {
        setNotices([]);
      }
    } catch (error) {
      console.error('Failed to load notices:', error);
      setNotices([]);
    } finally {
      setIsLoadingNotices(false);
    }
  };

  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    
    if (!newInquiry.title.trim() || !newInquiry.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const response = await fetch('/api/inquiry/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newInquiry),
      });

      if (response.ok) {
        const data = await response.json();
        setInquiries([data, ...inquiries]);
        setNewInquiry({ title: '', content: '' });
        setShowInquiryForm(false);
        alert('문의가 등록되었습니다.');
      } else {
        const errorData = await response.json().catch(() => ({ error: '문의 등록에 실패했습니다.' }));
        alert(errorData.error || '문의 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to submit inquiry:', error);
      alert('문의 등록 중 오류가 발생했습니다.');
    }
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(faqSearchQuery.toLowerCase())
  );

  const isLoggedIn = isMounted && getToken() && user;

  return (
    <>
      <AppShell styles={styles} title="문의하기" activeNav="inquiry" headerActions={null} onLoginClick={() => setShowLoginModal(true)}>
        <div className={styles.inquiryContainer}>
          {/* 공지사항과 빠른 Q&A를 나란히 배치 */}
          <div className={styles.topSectionsRow}>
            {/* 공지사항 섹션 */}
            <section className={styles.noticeSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>공지사항</h2>
              </div>
              {isLoadingNotices ? (
                <div className={styles.loading}>로딩 중...</div>
              ) : notices.length === 0 ? (
                <div className={styles.emptyState}>공지사항이 없습니다.</div>
              ) : (
                <div className={styles.noticeList}>
                  {notices.map((notice) => (
                    <div
                      key={notice.id}
                      className={`${styles.noticeItem} ${notice.isImportant ? styles.noticeItemImportant : ''}`}
                    >
                      <div
                        className={styles.noticeHeader}
                        onClick={() => setExpandedNoticeId(expandedNoticeId === notice.id ? null : notice.id)}
                      >
                        <div className={styles.noticeTitleRow}>
                          {notice.isImportant && <span className={styles.importantBadge}>중요</span>}
                          <h3 className={styles.noticeTitle}>{notice.title}</h3>
                        </div>
                        <div className={styles.noticeMeta}>
                          <span className={styles.noticeDate}>
                            {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
                          </span>
                          <span className={styles.noticeToggle}>
                            {expandedNoticeId === notice.id ? '▲' : '▼'}
                          </span>
                        </div>
                      </div>
                      {expandedNoticeId === notice.id && (
                        <div className={styles.noticeContent}>
                          <div className={styles.noticeText}>{notice.content}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 빠른 Q&A 섹션 */}
            <section className={styles.faqSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>빠른 Q&A</h2>
                <p className={styles.sectionSubtitle}>자주 묻는 질문을 확인하세요</p>
              </div>
              <div className={styles.faqSearch}>
                <input
                  type="text"
                  placeholder="질문 검색..."
                  value={faqSearchQuery}
                  onChange={(e) => setFaqSearchQuery(e.target.value)}
                  className={styles.faqSearchInput}
                />
              </div>
              {isLoadingFaqs ? (
                <div className={styles.loading}>로딩 중...</div>
              ) : filteredFaqs.length === 0 ? (
                <div className={styles.emptyState}>
                  {faqSearchQuery ? '검색 결과가 없습니다.' : '등록된 Q&A가 없습니다.'}
                </div>
              ) : (
                <div className={styles.faqList}>
                  {filteredFaqs.map((faq) => (
                    <div
                      key={faq.id}
                      className={`${styles.faqItem} ${expandedFaqId === faq.id ? styles.faqItemExpanded : ''}`}
                    >
                      <div
                        className={styles.faqQuestion}
                        onClick={() => setExpandedFaqId(expandedFaqId === faq.id ? null : faq.id)}
                      >
                        <span className={styles.faqQ}>Q</span>
                        <span className={styles.faqQuestionText}>{faq.question}</span>
                        <span className={styles.faqToggle}>
                          {expandedFaqId === faq.id ? '▲' : '▼'}
                        </span>
                      </div>
                      {expandedFaqId === faq.id && (
                        <div className={styles.faqAnswer}>
                          <span className={styles.faqA}>A</span>
                          <div className={styles.faqAnswerText}>{faq.answer}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* 내 문의 내역 섹션 */}
          {isLoggedIn ? (
            <section className={styles.inquirySection}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2 className={styles.sectionTitle}>내 문의 내역</h2>
                  <p className={styles.sectionSubtitle}>문의하신 내용과 답변을 확인하세요</p>
                </div>
                <button
                  className={styles.newInquiryButton}
                  onClick={() => setShowInquiryForm(!showInquiryForm)}
                >
                  {showInquiryForm ? '취소' : '+ 새 문의'}
                </button>
              </div>

              {/* 새 문의 작성 폼 */}
              {showInquiryForm && (
                <div className={styles.inquiryFormCard}>
                  <h3 className={styles.formTitle}>새 문의 작성</h3>
                  <form onSubmit={handleSubmitInquiry}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>제목 *</label>
                      <input
                        type="text"
                        value={newInquiry.title}
                        onChange={(e) => setNewInquiry({ ...newInquiry, title: e.target.value })}
                        placeholder="문의 제목을 입력하세요"
                        className={styles.formInput}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>내용 *</label>
                      <textarea
                        value={newInquiry.content}
                        onChange={(e) => setNewInquiry({ ...newInquiry, content: e.target.value })}
                        placeholder="문의 내용을 입력하세요"
                        className={styles.formTextarea}
                        rows={6}
                        required
                      />
                    </div>
                    <div className={styles.formActions}>
                      <button type="submit" className={styles.submitButton}>
                        문의 등록
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* 문의 내역 목록 */}
              {isLoadingInquiries ? (
                <div className={styles.loading}>로딩 중...</div>
              ) : inquiries.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>등록된 문의가 없습니다.</p>
                  <p>새 문의를 작성해주세요.</p>
                </div>
              ) : (
                <div className={styles.inquiryList}>
                  {inquiries.map((inquiry) => (
                    <div
                      key={inquiry.id}
                      className={`${styles.inquiryItem} ${
                        selectedInquiry === inquiry.id ? styles.inquiryItemSelected : ''
                      }`}
                    >
                      <div
                        className={styles.inquiryHeader}
                        onClick={() => setSelectedInquiry(selectedInquiry === inquiry.id ? null : inquiry.id)}
                      >
                        <div className={styles.inquiryTitleRow}>
                          <h3 className={styles.inquiryTitle}>{inquiry.title}</h3>
                          <span className={`${styles.statusBadge} ${
                            inquiry.status === 'answered' ? styles.statusAnswered : styles.statusPending
                          }`}>
                            {inquiry.status === 'answered' ? '답변 완료' : '답변 대기'}
                          </span>
                        </div>
                        <div className={styles.inquiryMeta}>
                          <span className={styles.inquiryDate}>
                            {new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}
                          </span>
                          <span className={styles.inquiryToggle}>
                            {selectedInquiry === inquiry.id ? '▲' : '▼'}
                          </span>
                        </div>
                      </div>
                      {selectedInquiry === inquiry.id && (
                        <div className={styles.inquiryContent}>
                          <div className={styles.inquiryQuestion}>
                            <h4 className={styles.contentLabel}>문의 내용</h4>
                            <div className={styles.contentText}>{inquiry.content}</div>
                          </div>
                          {inquiry.answer ? (
                            <div className={styles.inquiryAnswer}>
                              <h4 className={styles.contentLabel}>답변</h4>
                              <div className={styles.answerText}>{inquiry.answer}</div>
                              {inquiry.answeredAt && (
                                <div className={styles.answerDate}>
                                  {new Date(inquiry.answeredAt).toLocaleDateString('ko-KR')}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className={styles.inquiryNoAnswer}>
                              <p>아직 답변이 등록되지 않았습니다.</p>
                              <p>답변을 기다려주세요.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          ) : (
            <section className={styles.inquirySection}>
              <div className={styles.loginPrompt}>
                <p>문의 내역을 보려면 로그인이 필요합니다.</p>
                <button
                  className={styles.loginButton}
                  onClick={() => setShowLoginModal(true)}
                >
                  로그인하기
                </button>
              </div>
            </section>
          )}
        </div>
      </AppShell>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          const token = getToken();
          if (!token) {
            router.push('/company');
          }
        }}
        onSuccess={() => {
          const currentUser = getUser();
          setUser(currentUser);
          setShowLoginModal(false);
          loadInquiries();
        }}
      />
    </>
  );
}
