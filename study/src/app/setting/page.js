'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { AppShell } from '../components/AppShell';
import { LoginModal } from '../components/LoginModal';
import { getUser, getToken } from '@/utils/auth';

export default function SettingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // 임베딩 문서 상태
  const [documents, setDocuments] = useState([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalDocuments: 0,
    completedDocuments: 0,
    processingDocuments: 0,
    failedDocuments: 0,
    totalChunks: 0,
    totalSize: 0,
  });
  
  // 업로드 모달 상태
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newDocument, setNewDocument] = useState({ title: '', file: null });

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
    loadDocuments();
    loadStats();
    
    // 로그인 상태 변경 감지
    const handleLoginChange = () => {
      const newToken = getToken();
      const newUser = getUser();
      if (!newToken || !newUser) {
        setShowLoginModal(true);
        setUser(null);
      } else {
        setUser(newUser);
        loadDocuments();
        loadStats();
      }
    };
    window.addEventListener('loginStatusChange', handleLoginChange);
    window.addEventListener('storage', handleLoginChange);

    return () => {
      window.removeEventListener('loginStatusChange', handleLoginChange);
      window.removeEventListener('storage', handleLoginChange);
    };
  }, [currentPage]);

  const loadDocuments = async () => {
    try {
      setIsLoadingDocuments(true);
      const token = getToken();
      if (!token) {
        setIsLoadingDocuments(false);
        return;
      }

      const response = await fetch(`/api/embedding/documents?page=${currentPage}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents);
        setTotalPages(data.totalPages);
      } else {
        setDocuments([]);
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
      setDocuments([]);
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch('/api/embedding/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewDocument({
        ...newDocument,
        file: file,
        title: newDocument.title || file.name,
      });
    }
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    
    if (!newDocument.title.trim() || !newDocument.file) {
      alert('제목과 파일을 선택해주세요.');
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      setUploadingFile(newDocument.file);
      setUploadProgress(0);

      // 파일을 base64로 변환
      const reader = new FileReader();
      const base64 = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(newDocument.file);
      });

      // 파일 업로드
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          file: base64,
          fileName: newDocument.file.name,
        }),
      });

      if (!uploadResponse.ok) {
        throw new Error('파일 업로드에 실패했습니다.');
      }

      const uploadData = await uploadResponse.json();
      setUploadProgress(50);

      // 임베딩 문서 등록
      const docResponse = await fetch('/api/embedding/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newDocument.title.trim(),
          fileName: newDocument.file.name,
          fileType: newDocument.file.type,
          fileSize: newDocument.file.size,
          fileUrl: uploadData.url,
        }),
      });

      if (docResponse.ok) {
        setUploadProgress(100);
        setNewDocument({ title: '', file: null });
        setShowUploadModal(false);
        alert('문서가 등록되었습니다. 임베딩 처리가 진행됩니다.');
        loadDocuments();
        loadStats();
      } else {
        const errorData = await docResponse.json().catch(() => ({ error: '문서 등록에 실패했습니다.' }));
        alert(errorData.error || '문서 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to upload document:', error);
      alert('문서 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploadingFile(null);
      setUploadProgress(0);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!confirm('정말 이 문서를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const response = await fetch(`/api/embedding/documents?id=${docId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('문서가 삭제되었습니다.');
        loadDocuments();
        loadStats();
      } else {
        const errorData = await response.json().catch(() => ({ error: '문서 삭제에 실패했습니다.' }));
        alert(errorData.error || '문서 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
      alert('문서 삭제 중 오류가 발생했습니다.');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const isLoggedIn = isMounted && getToken() && user;

  return (
    <>
      <AppShell styles={styles} title="임베딩 설정" activeNav="settings" headerActions={null} onLoginClick={() => setShowLoginModal(true)}>
        {!isLoggedIn ? (
          <div className={styles.loginPrompt}>
            <p>임베딩 설정을 사용하려면 로그인이 필요합니다.</p>
            <button
              className={styles.loginButton}
              onClick={() => setShowLoginModal(true)}
            >
              로그인하기
            </button>
          </div>
        ) : (
          <div className={styles.settingContainer}>
            {/* 통계 카드 */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📄</div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{stats.totalDocuments}</div>
                  <div className={styles.statLabel}>전체 문서</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>✅</div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{stats.completedDocuments}</div>
                  <div className={styles.statLabel}>완료된 문서</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>⚙️</div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{stats.processingDocuments}</div>
                  <div className={styles.statLabel}>처리 중</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🧩</div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{stats.totalChunks}</div>
                  <div className={styles.statLabel}>총 청크 수</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>💾</div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{formatFileSize(stats.totalSize)}</div>
                  <div className={styles.statLabel}>저장 용량</div>
                </div>
              </div>
            </div>

            {/* 문서 목록 섹션 */}
            <section className={styles.documentsSection}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2 className={styles.sectionTitle}>임베딩 문서 목록</h2>
                  <p className={styles.sectionSubtitle}>임베딩된 문서를 관리하세요</p>
                </div>
                <button
                  className={styles.uploadButton}
                  onClick={() => setShowUploadModal(true)}
                >
                  + 새 문서 업로드
                </button>
              </div>

              {isLoadingDocuments ? (
                <div className={styles.loading}>로딩 중...</div>
              ) : documents.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>등록된 임베딩 문서가 없습니다.</p>
                  <p>새 문서를 업로드하여 임베딩하세요.</p>
                </div>
              ) : (
                <>
                  <div className={styles.documentsList}>
                    {documents.map((doc) => (
                      <div key={doc.id} className={styles.documentItem}>
                        <div className={styles.documentInfo}>
                          <div className={styles.documentHeader}>
                            <h3 className={styles.documentTitle}>{doc.title}</h3>
                            <span className={`${styles.statusBadge} ${
                              doc.status === 'completed' ? styles.statusCompleted :
                              doc.status === 'processing' ? styles.statusProcessing :
                              styles.statusFailed
                            }`}>
                              {doc.status === 'completed' ? '완료' :
                               doc.status === 'processing' ? '처리 중' :
                               '실패'}
                            </span>
                          </div>
                          <div className={styles.documentMeta}>
                            <span className={styles.documentFileName}>{doc.fileName}</span>
                            <span className={styles.documentSeparator}>•</span>
                            <span className={styles.documentSize}>{formatFileSize(doc.fileSize)}</span>
                            <span className={styles.documentSeparator}>•</span>
                            <span className={styles.documentChunks}>{doc.chunkCount}개 청크</span>
                            <span className={styles.documentSeparator}>•</span>
                            <span className={styles.documentDate}>
                              {new Date(doc.createdAt).toLocaleDateString('ko-KR')}
                            </span>
                          </div>
                        </div>
                        <div className={styles.documentActions}>
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDeleteDocument(doc.id)}
                            title="삭제"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 페이지네이션 */}
                  {totalPages > 1 && (
                    <div className={styles.pagination}>
                      <button
                        className={styles.paginationButton}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        이전
                      </button>
                      <span className={styles.paginationInfo}>
                        {currentPage} / {totalPages}
                      </span>
                      <button
                        className={styles.paginationButton}
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        다음
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        )}

        {/* 업로드 모달 */}
        {showUploadModal && (
          <div className={styles.modalOverlay} onClick={() => setShowUploadModal(false)}>
            <div className={styles.uploadModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>새 문서 업로드</h3>
                <button
                  className={styles.modalCloseButton}
                  onClick={() => {
                    setShowUploadModal(false);
                    setNewDocument({ title: '', file: null });
                    setUploadProgress(0);
                  }}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleUploadDocument} className={styles.uploadForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>문서 제목 *</label>
                  <input
                    type="text"
                    value={newDocument.title}
                    onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                    placeholder="문서 제목을 입력하세요"
                    className={styles.formInput}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>파일 선택 *</label>
                  <div className={styles.fileInputWrapper}>
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      className={styles.fileInput}
                      accept=".pdf,.doc,.docx,.txt,.md"
                      required
                    />
                    {newDocument.file && (
                      <div className={styles.fileInfo}>
                        <span className={styles.fileName}>{newDocument.file.name}</span>
                        <span className={styles.fileSize}>{formatFileSize(newDocument.file.size)}</span>
                      </div>
                    )}
                  </div>
                  <p className={styles.helperText}>
                    지원 형식: PDF, DOC, DOCX, TXT, MD
                  </p>
                </div>
                {uploadingFile && (
                  <div className={styles.uploadProgress}>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <span className={styles.progressText}>{uploadProgress}%</span>
                  </div>
                )}
                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => {
                      setShowUploadModal(false);
                      setNewDocument({ title: '', file: null });
                      setUploadProgress(0);
                    }}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={uploadingFile}
                  >
                    {uploadingFile ? '업로드 중...' : '업로드'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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
          loadDocuments();
          loadStats();
        }}
      />
    </>
  );
}
