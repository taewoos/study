'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { AppShell } from '../components/AppShell';
import { isAdmin } from '@/utils/auth';

const imageBoardItems = [
  { id: 1, title: '2025년 1분기 업데이트', image: '/test1.png' },
  { id: 2, title: 'Custom AI 신규 기능', thumb: true },
  { id: 3, title: '고객사 사례 소개', thumb: true },
];
const tipPosts = [
  { id: 1, title: '효율적인 프롬프트 작성 방법' },
  { id: 2, title: 'LLM 활용 업무 자동화 TIP' },
  { id: 3, title: '보안 설정 가이드' },
];
const newsItems = [
  { id: 1, title: '서비스 업데이트 안내', date: '2025.01.15' },
  { id: 2, title: '연말연시 고객센터 운영', date: '2024.12.20' },
  { id: 3, title: '개인정보 처리방침 개정', date: '2024.12.10' },
];
const alertItems = [
  { id: 1, text: '새 글이 등록되었습니다.', time: '10:30' },
  { id: 2, text: '댓글이 달렸습니다.', time: '09:15' },
  { id: 3, text: '업데이트가 완료되었습니다.', time: '어제' },
];

export default function NewsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [imageBoardIndex, setImageBoardIndex] = useState(0);
  const imageBoardTotal = imageBoardItems.length;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const checkAdmin = () => setIsAdminUser(isAdmin());
    checkAdmin();
    window.addEventListener('loginStatusChange', checkAdmin);
    window.addEventListener('storage', checkAdmin);
    return () => {
      window.removeEventListener('loginStatusChange', checkAdmin);
      window.removeEventListener('storage', checkAdmin);
    };
  }, [isMounted]);

  if (!isMounted) {
    return <div>로딩 중...</div>;
  }

  return (
    <AppShell styles={styles} title="" activeNav="news" headerActions={null}>
      <div className={styles.newsWrap}>
        {/* 상단 배너 (통일된 배경) */}
        <section className={styles.banner} />

        {/* 2x2 그리드 */}
        <section className={styles.gridSection}>
          <div className={styles.gridInner}>
            {/* 좌상: 이미지 게시판 (캐러셀) */}
            <div className={styles.block}>
              <div className={styles.imageBoardHeader}>
                <h3 className={styles.blockTitle}>이미지 게시판</h3>
                <a href="#" className={styles.imageBoardViewAll}>전체 보기</a>
              </div>
              <div className={styles.imageBoardCarousel}>
                <div className={styles.imageBoardViewport}>
                  <div
                    className={styles.imageBoardTrack}
                    style={{ transform: `translateX(-${imageBoardIndex * (100 / imageBoardTotal)}%)` }}
                  >
                    {imageBoardItems.map((item) => (
                      <div key={item.id} className={styles.imageBoardSlide}>
                        <div className={styles.imageBoardLink}>
                          {item.image ? (
                            <img src={item.image} alt="" className={styles.imageBoardThumbImg} />
                          ) : (
                            <span className={styles.imageBoardThumb} />
                          )}
                          <span className={styles.imageBoardTitle}>{item.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.imageBoardFooter}>
                <button
                  type="button"
                  className={styles.imageBoardNavBtn}
                  aria-label="이전"
                  onClick={() => setImageBoardIndex((i) => (i <= 0 ? imageBoardTotal - 1 : i - 1))}
                >
                  ‹
                </button>
                <div className={styles.imageBoardDots}>
                  {imageBoardItems.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={idx === imageBoardIndex ? styles.imageBoardDotActive : styles.imageBoardDot}
                      aria-label={`${idx + 1}번 슬라이드`}
                      onClick={() => setImageBoardIndex(idx)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className={styles.imageBoardNavBtn}
                  aria-label="다음"
                  onClick={() => setImageBoardIndex((i) => (i >= imageBoardTotal - 1 ? 0 : i + 1))}
                >
                  ›
                </button>
              </div>
            </div>

            {/* 우상: Tip 게시글 */}
            <div className={styles.block}>
              <h3 className={styles.blockTitle}>Tip</h3>
              <p className={styles.blockSub}>게시글</p>
              <ul className={styles.blockList}>
                {tipPosts.map((item) => (
                  <li key={item.id}>
                    <a href="#">{item.title}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* 좌하: /news */}
            <div className={styles.block}>
              <h3 className={styles.blockTitle}>News</h3>
              <ul className={styles.blockList}>
                {newsItems.map((item) => (
                  <li key={item.id} className={styles.newsRow}>
                    <a href="#">{item.title}</a>
                    <span className={styles.newsDate}>{item.date}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 우하: 알림 */}
            <div className={styles.block}>
              <h3 className={styles.blockTitle}>알림</h3>
              <ul className={styles.blockList}>
                {alertItems.map((item) => (
                  <li key={item.id} className={styles.alertRow}>
                    <span className={styles.alertText}>{item.text}</span>
                    <span className={styles.alertTime}>{item.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
