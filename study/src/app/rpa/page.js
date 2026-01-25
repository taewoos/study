'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { AppShell } from '../components/AppShell';
import { getToken } from '@/utils/auth';

export default function RPAPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [newProject, setNewProject] = useState({
    title: '',
    description: ''
  });

  // 프로젝트 목록 불러오기
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        console.error('인증 토큰이 없습니다.');
        setIsLoading(false);
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
        setProjects(data);
      } else {
        console.error('프로젝트를 불러오는데 실패했습니다.');
        setProjects([]);
      }
    } catch (error) {
      console.error('프로젝트 로드 오류:', error);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.title.trim() || !newProject.description.trim()) {
      alert('제목과 설명을 모두 입력해주세요.');
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        alert('인증이 필요합니다. 로그인해주세요.');
        return;
      }

      const response = await fetch('/api/rpa/projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newProject.title.trim(),
          description: newProject.description.trim()
        })
      });

      if (response.ok) {
        const createdProject = await response.json();
        setProjects([createdProject, ...projects]);
        setNewProject({ title: '', description: '' });
        setShowCreateModal(false);
        fetchProjects(); // 목록 새로고침
      } else {
        const error = await response.json();
        alert(error.error || '프로젝트 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('프로젝트 생성 오류:', error);
      alert('프로젝트 생성 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteProject = async (projectId, e) => {
    e.stopPropagation();
    
    if (!confirm('이 프로젝트를 삭제하시겠습니까? 프로젝트와 관련된 모든 Task도 함께 삭제됩니다.')) {
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        alert('인증이 필요합니다.');
        return;
      }

      const response = await fetch(`/api/rpa/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setProjects(projects.filter(project => project.id !== projectId));
      } else {
        const error = await response.json();
        alert(error.error || '프로젝트 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('프로젝트 삭제 오류:', error);
      alert('프로젝트 삭제 중 오류가 발생했습니다.');
    }
  };

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
    <AppShell styles={styles} title="RPA 프로젝트" activeNav="rpa" headerActions={headerActions}>
      <div className={styles.content}>
        {/* Projects Header with Create Button */}
        <div className={styles.projectsHeader}>
          <h2 className={styles.projectsTitle}>프로젝트 목록</h2>
          <button
            className={styles.createButton}
            onClick={() => setShowCreateModal(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>프로젝트 등록</span>
          </button>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className={styles.loadingState}>
            <p>프로젝트를 불러오는 중...</p>
          </div>
        ) : (
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
                    <div className={styles.cardHeaderRight}>
                      <div className={styles.cardIcon}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                          <line x1="16" y1="13" x2="8" y2="13"/>
                          <line x1="16" y1="17" x2="8" y2="17"/>
                          <polyline points="10 9 9 9 8 9"/>
                        </svg>
                      </div>
                      <button
                        className={styles.deleteProjectButton}
                        onClick={(e) => handleDeleteProject(project.id, e)}
                        title="프로젝트 삭제"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
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
        )}

        {!isLoading && projects.length === 0 && (
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
