'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { AppShell } from '../components/AppShell';

export default function RPAPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const router = useRouter();
  const [projects, setProjects] = useState([
    {
      id: 1,
      date: '2025-11-12',
      title: '세금계산서 수정_erp',
      description: '업무 관련 자동화 프로젝트입니다.',
      status: 'active'
    },
    {
      id: 2,
      date: '2025-01-08',
      title: '재고 관리 자동화',
      description: 'ERP 시스템과 연동하여 재고를 자동으로 관리합니다.',
      status: 'active'
    },
    {
      id: 3,
      date: '2024-12-20',
      title: '고객 데이터 수집',
      description: '웹사이트에서 고객 정보를 자동으로 수집하는 프로젝트입니다.',
      status: 'completed'
    }
  ]);

  const [newProject, setNewProject] = useState({
    title: '',
    description: ''
  });

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (newProject.title.trim() && newProject.description.trim()) {
      const project = {
        id: projects.length + 1,
        date: new Date().toISOString().split('T')[0],
        title: newProject.title,
        description: newProject.description,
        status: 'active'
      };
      setProjects([project, ...projects]);
      setNewProject({ title: '', description: '' });
      setShowCreateModal(false);
    }
  };

  const headerActions = (
    <>
      <button
        className={styles.createButton}
        onClick={() => setShowCreateModal(true)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span>프로젝트 등록</span>
      </button>
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
    <AppShell styles={styles} title="RPA 프로젝트" activeNav="rpa" headerActions={headerActions}>
        {/* Content Area */}
        <div className={styles.content}>
          {/* Projects Grid */}
          <div className={styles.projectsGrid}>
            {projects.map((project) => (
              <div
                key={project.id}
                className={styles.projectCard}
                role="button"
                tabIndex={0}
                onClick={() => router.push(`/rpa/${project.id}`)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    router.push(`/rpa/${project.id}`);
                  }
                }}
              >
                <div className={styles.cardLeftBorder}></div>
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <span className={styles.projectDate}>{project.date}</span>
                    <div className={styles.cardIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10 9 9 9 8 9"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <p className={styles.projectDescription}>{project.description}</p>
                  <span className={styles.viewDetailsLink}>
                    자세히 보기 →
                  </span>
                </div>
              </div>
            ))}
          </div>

          {projects.length === 0 && (
            <div className={styles.emptyState}>
              <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              <h3 className={styles.emptyTitle}>등록된 프로젝트가 없습니다</h3>
              <p className={styles.emptyDescription}>새로운 RPA 프로젝트를 등록해보세요.</p>
              <button 
                className={styles.emptyButton}
                onClick={() => setShowCreateModal(true)}
              >
                프로젝트 등록하기
              </button>
            </div>
          )}
        </div>
      {/* Create Project Modal */}
      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>새 프로젝트 등록</h2>
              <button 
                className={styles.modalClose}
                onClick={() => setShowCreateModal(false)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateProject} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label htmlFor="title" className={styles.formLabel}>프로젝트 제목</label>
                <input
                  id="title"
                  type="text"
                  className={styles.formInput}
                  placeholder="예: 세금계산서 수정_erp"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.formLabel}>프로젝트 설명</label>
                <textarea
                  id="description"
                  className={styles.formTextarea}
                  placeholder="프로젝트에 대한 설명을 입력하세요"
                  rows="4"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <button 
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowCreateModal(false)}
                >
                  취소
                </button>
                <button type="submit" className={styles.submitButton}>
                  등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
