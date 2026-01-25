'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { AppShell } from '../../components/AppShell';
import { getToken } from '@/utils/auth';

export default function RPAProjectPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const projectId = resolvedParams?.id;
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({ label: '', status: 'ready', sshKey: '' });
  const [showSshKey, setShowSshKey] = useState(false);
  const [showEditSshKey, setShowEditSshKey] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        console.error('인증 토큰이 없습니다.');
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/rpa/projects/${projectId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProject(data);
      } else if (response.status === 404) {
        // 프로젝트가 없으면 빈 프로젝트로 초기화
        setProject({
          id: projectId,
          title: '새 프로젝트',
          description: '',
          tasks: [],
          logs: []
        });
      } else {
        console.error('프로젝트를 불러오는데 실패했습니다.');
        setProject({
          id: projectId,
          title: '새 프로젝트',
          description: '',
          tasks: [],
          logs: []
        });
      }
    } catch (error) {
      console.error('프로젝트 로드 오류:', error);
      setProject({
        id: projectId,
        title: '새 프로젝트',
        description: '',
        tasks: [],
        logs: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.label.trim()) {
      alert('Task 라벨을 입력해주세요.');
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        alert('인증이 필요합니다.');
        return;
      }

      const response = await fetch('/api/rpa/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectId: projectId,
          label: newTask.label.trim(),
          status: newTask.status,
          sshKey: newTask.sshKey.trim() || null
        })
      });

      if (response.ok) {
        const createdTask = await response.json();
        setProject(prev => ({
          ...prev,
          tasks: [createdTask, ...(prev.tasks || [])]
        }));
        setNewTask({ label: '', status: 'ready', sshKey: '' });
        setShowCreateTaskModal(false);
        fetchProject(); // 목록 새로고침
      } else {
        const error = await response.json();
        alert(error.error || 'Task 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Task 생성 오류:', error);
      alert('Task 생성 중 오류가 발생했습니다.');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({ 
      label: task.label || '', 
      status: task.status || 'ready',
      sshKey: task.sshKey || ''
    });
    setShowEditSshKey(false);
    setShowEditTaskModal(true);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!newTask.label.trim()) {
      alert('Task 라벨을 입력해주세요.');
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        alert('인증이 필요합니다.');
        return;
      }

      const response = await fetch('/api/rpa/tasks', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          taskId: editingTask.id,
          projectId: projectId,
          label: newTask.label.trim(),
          status: newTask.status,
          sshKey: newTask.sshKey.trim() || null
        })
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setProject(prev => ({
          ...prev,
          tasks: prev.tasks.map(task => 
            task.id === editingTask.id ? updatedTask : task
          )
        }));
        setNewTask({ label: '', status: 'ready', sshKey: '' });
        setEditingTask(null);
        setShowEditTaskModal(false);
        fetchProject(); // 목록 새로고침
      } else {
        const error = await response.json();
        alert(error.error || 'Task 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Task 수정 오류:', error);
      alert('Task 수정 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteTask = async (taskId, e) => {
    e.stopPropagation();
    
    if (!confirm('이 Task를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        alert('인증이 필요합니다.');
        return;
      }

      const response = await fetch(`/api/rpa/tasks?taskId=${taskId}&projectId=${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setProject(prev => ({
          ...prev,
          tasks: prev.tasks.filter(task => task.id !== taskId)
        }));
      } else {
        const error = await response.json();
        alert(error.error || 'Task 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Task 삭제 오류:', error);
      alert('Task 삭제 중 오류가 발생했습니다.');
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? '오후' : '오전';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${year}. ${month}. ${day}. ${ampm} ${displayHours}:${minutes}:${seconds}`;
  };

  const headerActions = null;

  if (isLoading) {
    return (
      <AppShell styles={styles} title="RPA Analyst" activeNav="rpa" headerActions={headerActions}>
        <main className={styles.main}>
          <div className={styles.loadingState}>
            <p>프로젝트를 불러오는 중...</p>
          </div>
        </main>
      </AppShell>
    );
  }

  if (!project) {
    return (
      <AppShell styles={styles} title="RPA Analyst" activeNav="rpa" headerActions={headerActions}>
        <main className={styles.main}>
          <div className={styles.emptyState}>
            <p>프로젝트를 찾을 수 없습니다.</p>
            <a href="/rpa" className={styles.backLink}>← 프로젝트 목록으로</a>
          </div>
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell styles={styles} title="RPA Analyst" activeNav="rpa" headerActions={headerActions}>
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <a href="/rpa" className={styles.backLink}>← RPA Analyst</a>
          <div className={styles.headerSubtitle}>
            <span>{project.title}</span>
            {project.tasks && project.tasks.length > 0 && (
              <button
                className={styles.addTaskButton}
                onClick={() => setShowCreateTaskModal(true)}
                title="Task 추가"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span>등록하기</span>
              </button>
            )}
          </div>
        </div>

        <section className={styles.cards}>
          {project.tasks && project.tasks.length > 0 ? (
            project.tasks.map((task) => {
              // 상태에 따른 클래스 결정
              const getStatusClass = () => {
                if (task.status === 'running' || task.status === 'success') {
                  return styles.cardRunning;
                } else if (task.status === 'error' || task.status === 'failed') {
                  return styles.cardError;
                } else {
                  return styles.cardWaiting;
                }
              };

              const getButtonText = () => {
                if (task.status === 'running' || task.status === 'success') {
                  return '실행중';
                } else if (task.status === 'error' || task.status === 'failed') {
                  return '오류';
                } else {
                  return 'START';
                }
              };

              return (
                <div key={task.id} className={`${styles.card} ${getStatusClass()}`}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>{task.label}</span>
                    <div className={styles.cardHeaderRight}>
                      <span className={styles.cardStatus} data-status={task.status} />
                      <button
                        className={styles.editTaskButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTask(task);
                        }}
                        title="Task 수정"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button
                        className={styles.deleteTaskButton}
                        onClick={(e) => handleDeleteTask(task.id, e)}
                        title="Task 삭제"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className={styles.cardMeta}>업데이트: {formatTime(task.time)}</div>
                  <button className={`${styles.cardButton} ${getStatusClass()}`}>
                    {getButtonText()}
                  </button>
                </div>
              );
            })
          ) : (
            <div className={styles.emptyCards}>
              <button
                className={styles.createTaskButton}
                onClick={() => setShowCreateTaskModal(true)}
              >
                등록하기
              </button>
            </div>
          )}
        </section>

        <section className={styles.logSection}>
          <h2 className={styles.logTitle}>{project.title} 로그</h2>
          <div className={styles.logList}>
            {project.logs && project.logs.length > 0 ? (
              project.logs.map((log, index) => (
                <div key={index} className={styles.logItem}>
                  {log}
                </div>
              ))
            ) : (
              <div className={styles.emptyLogs}>
                <p>로그가 없습니다.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Create Task Modal */}
      {showCreateTaskModal && (
        <div className={styles.modalOverlay} onClick={() => {
          setShowCreateTaskModal(false);
          setNewTask({ label: '', status: 'ready', sshKey: '' });
          setShowSshKey(false);
        }}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>새 Task 등록</h2>
              <button 
                className={styles.modalClose}
                onClick={() => {
                  setShowCreateTaskModal(false);
                  setNewTask({ label: '', status: 'ready', sshKey: '' });
                  setShowSshKey(false);
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateTask} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label htmlFor="taskLabel" className={styles.formLabel}>Task 라벨</label>
                <input
                  id="taskLabel"
                  type="text"
                  className={styles.formInput}
                  placeholder="예: 수정(erp)"
                  value={newTask.label}
                  onChange={(e) => setNewTask({ ...newTask, label: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="taskStatus" className={styles.formLabel}>상태</label>
                <select
                  id="taskStatus"
                  className={styles.formInput}
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                >
                  <option value="ready">대기중</option>
                  <option value="running">실행중</option>
                  <option value="success">성공</option>
                  <option value="error">오류</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="taskSshKey" className={styles.formLabel}>SSH Key</label>
                <div className={styles.passwordInputWrapper}>
                  <input
                    id="taskSshKey"
                    type={showSshKey ? 'text' : 'password'}
                    className={styles.formInput}
                    placeholder="SSH 연결을 위한 key 값을 입력하세요"
                    value={newTask.sshKey}
                    onChange={(e) => setNewTask({ ...newTask, sshKey: e.target.value })}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowSshKey(!showSshKey)}
                    title={showSshKey ? '숨기기' : '보기'}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {showSshKey ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>
              <div className={styles.modalActions}>
                <button 
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowCreateTaskModal(false);
                    setNewTask({ label: '', status: 'ready', sshKey: '' });
                  }}
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

      {/* Edit Task Modal */}
      {showEditTaskModal && editingTask && (
        <div className={styles.modalOverlay} onClick={() => {
          setShowEditTaskModal(false);
          setEditingTask(null);
          setNewTask({ label: '', status: 'ready', sshKey: '' });
          setShowEditSshKey(false);
        }}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Task 수정</h2>
              <button 
                className={styles.modalClose}
                onClick={() => {
                  setShowEditTaskModal(false);
                  setEditingTask(null);
                  setNewTask({ label: '', status: 'ready', sshKey: '' });
                  setShowEditSshKey(false);
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleUpdateTask} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label htmlFor="editTaskLabel" className={styles.formLabel}>Task 라벨</label>
                <input
                  id="editTaskLabel"
                  type="text"
                  className={styles.formInput}
                  placeholder="예: 수정(erp)"
                  value={newTask.label}
                  onChange={(e) => setNewTask({ ...newTask, label: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="editTaskStatus" className={styles.formLabel}>상태</label>
                <select
                  id="editTaskStatus"
                  className={styles.formInput}
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                >
                  <option value="ready">대기중</option>
                  <option value="running">실행중</option>
                  <option value="success">성공</option>
                  <option value="error">오류</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="editTaskSshKey" className={styles.formLabel}>SSH Key</label>
                <div className={styles.passwordInputWrapper}>
                  <input
                    id="editTaskSshKey"
                    type={showEditSshKey ? 'text' : 'password'}
                    className={styles.formInput}
                    placeholder="SSH 연결을 위한 key 값을 입력하세요"
                    value={newTask.sshKey}
                    onChange={(e) => setNewTask({ ...newTask, sshKey: e.target.value })}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowEditSshKey(!showEditSshKey)}
                    title={showEditSshKey ? '숨기기' : '보기'}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {showEditSshKey ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>
              <div className={styles.modalActions}>
                <button 
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowEditTaskModal(false);
                    setEditingTask(null);
                    setNewTask({ label: '', status: 'ready', sshKey: '' });
                  }}
                >
                  취소
                </button>
                <button type="submit" className={styles.submitButton}>
                  수정하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
