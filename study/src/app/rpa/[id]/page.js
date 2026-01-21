 'use client';

import { useMemo } from 'react';
import styles from './page.module.css';
import { AppShell } from '../../components/AppShell';

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
  const projectId = Number(params?.id);

  const project = useMemo(
    () => PROJECTS.find((item) => item.id === projectId) || PROJECTS[0],
    [projectId]
  );

  const headerActions = null;

  return (
    <AppShell styles={styles} title={project.summary} activeNav="rpa" headerActions={headerActions}>
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <a href="/rpa" className={styles.backLink}>← RPA Analyst</a>
          <div className={styles.headerSubtitle}>{project.title}</div>
        </div>

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
    </AppShell>
  );
}
