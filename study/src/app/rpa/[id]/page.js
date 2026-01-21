'use client';

import { useMemo, useState } from 'react';
import styles from './page.module.css';

const PROJECTS = [
  {
    id: 1,
    title: '세금계산서 수정_erp',
    summary: 'RPA Analyst',
    tasks: [
      { id: 1, label: '수정(erp)', status: 'running', time: '2025. 11. 13. 오후 7:07:19' },
      { id: 2, label: '발송(준비)', status: 'ready', time: '2025. 11. 13. 오후 7:05:04' },
      { id: 3, label: '발송(실행)', status: 'success', time: '2025. 11. 12. 오후 12:55:56' }
    ],
    logs: [
      'API설정 / 알림설정 / 알림관리 / 프로세스 시작 / 발송(실행) 프로세스 시작합니다. / 2025-11-13 PM 7:05:46 / 성공',
      'API설정 / 알림설정 / 알림관리 / 알림설정 수정 / 2025-11-13 PM 7:05:46 / 성공',
      'DB 연결 / DB 연결 / 설정테스트 / DB 연결 설정 / 2025-11-13 PM 7:05:47 / 성공',
      '매장 수집 / 발주 건별 수집 / 설정테스트 / 발주 건별 수집설정 / 2025-11-13 PM 7:05:47 / 성공',
      '발송 건 설정 / 발송 건 설정 / 설정테스트 / 발송 건 설정 / 2025-11-13 PM 7:05:47 / 성공'
    ]
  }
];

export default function RPAProjectPage({ params }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const projectId = Number(params?.id);

  const project = useMemo(
    () => PROJECTS.find((item) => item.id === projectId) || PROJECTS[0],
    [projectId]
  );

  return (
    <div className={styles.container}>
      {/* Left Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>SS</div>
            <span className={styles.logoText}>시와소프트</span>
          </div>
          <button
            className={styles.sidebarToggle}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label="Toggle sidebar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

        <nav className={styles.nav}>
          <a href="/home" className={styles.navItem}>
            <span>HOME</span>
          </a>
          <a href="/rpa" className={`${styles.navItem} ${styles.navItemActive}`}>
            <span>RPA</span>
          </a>
          <a href="/aillm" className={styles.navItem}>
            <span>AI LLM</span>
          </a>
          <a href="/ocr" className={styles.navItem}>
            <span>AI OCR</span>
          </a>
          <a href="/inquiry" className={styles.navItem}>
            <span>INQUIRY</span>
          </a>
          <a href="/settings" className={styles.navItem}>
            <span>SETTING</span>
          </a>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <a href="/rpa" className={styles.backLink}>←</a>
            <span className={styles.headerTitle}>{project.summary}</span>
          </div>
          <div className={styles.headerSubtitle}>{project.title}</div>
        </header>

        <section className={styles.cards}>
          {project.tasks.map((task) => (
            <div key={task.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>{task.label}</span>
                <span className={styles.cardStatus} data-status={task.status} />
              </div>
              <div className={styles.cardMeta}>업데이트: {task.time}</div>
              <button className={styles.cardButton}>
                {task.status === 'success' ? '실행중' : 'START'}
              </button>
            </div>
          ))}
        </section>

        <section className={styles.logSection}>
          <h2 className={styles.logTitle}>{project.title} 로그</h2>
          <div className={styles.logList}>
            {project.logs.map((log, index) => (
              <div key={index} className={styles.logItem}>
                {log}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
