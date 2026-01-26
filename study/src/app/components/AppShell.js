'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUser, getToken } from '@/utils/auth';

export function AppShell({ styles, title, activeNav, headerActions, children, showLogo = true, onLoginClick }) {
  const year = new Date().getFullYear();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [rpaNotifications, setRpaNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  // RPA 알림 가져오기
  const fetchRpaNotifications = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch('/api/rpa/notifications?read=false');
      if (response.ok) {
        const data = await response.json();
        setRpaNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Failed to fetch RPA notifications:', error);
    }
  };

  useEffect(() => {
    // 로그인 상태 확인 (JWT 토큰 기반)
    const checkLoginStatus = () => {
      const token = getToken();
      if (token) {
        const userData = getUser();
        if (userData) {
          setIsLoggedIn(true);
          setUser(userData);
          // 로그인 시 알림 가져오기
          fetchRpaNotifications();
        } else {
          setIsLoggedIn(false);
          setUser(null);
          setRpaNotifications([]);
          setUnreadCount(0);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setRpaNotifications([]);
        setUnreadCount(0);
      }
    };
    
    checkLoginStatus();
    // 로그인 상태 변경 감지를 위한 이벤트 리스너 (선택사항)
    window.addEventListener('storage', checkLoginStatus);
    
    // 커스텀 이벤트 리스너 (같은 탭에서 로그인/로그아웃 시 상태 업데이트)
    const handleLoginChange = () => {
      checkLoginStatus();
    };
    window.addEventListener('loginStatusChange', handleLoginChange);
    
    // 주기적으로 알림 확인 (30초마다)
    const notificationInterval = setInterval(() => {
      if (isLoggedIn) {
        fetchRpaNotifications();
      }
    }, 30000);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('loginStatusChange', handleLoginChange);
      clearInterval(notificationInterval);
    };
  }, [isLoggedIn]);

  const handleLogout = async () => {
    try {
      // 로그아웃 API 호출 (선택사항)
      await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // 로컬 스토리지 및 세션 스토리지에서 JWT 토큰 및 사용자 정보 제거
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      setIsLoggedIn(false);
      setUser(null);
      
      // 로그인 상태 변경 이벤트 발생
      window.dispatchEvent(new Event('loginStatusChange'));
      
      // 회사 소개 페이지로 이동
      window.location.href = '/company';
    }
  };

  // Ensure the footer stays at the bottom even when individual page CSS differs.
  const shellLayoutStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  };

  const mainFlexStyle = {
    flex: 1,
  };

  const footerStyle = {
    background: '#f5f5f5',
    borderTop: '1px solid #e5e5e5',
    padding: '60px 45px',
    color: '#666',
  };

  const footerInnerStyle = {
    maxWidth: 1400,
    margin: '0 auto',
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap',
  };

  const footerBrandStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  };

  const footerLogoRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    color: '#1a1a1a',
    fontWeight: 600,
  };

  const footerLogoIconStyle = {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
    color: '#fff',
    fontSize: 12,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  const footerMetaStyle = {
    fontSize: 13,
    lineHeight: 1.5,
  };

  const footerLinksStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    flexWrap: 'wrap',
    fontSize: 13,
  };

  const footerLinkStyle = {
    color: '#666',
    textDecoration: 'none',
  };

  return (
    <div className={styles.container} style={shellLayoutStyle}>
      {/* Top Header with Navigation */}
      <header className={styles.topHeader}>
        {showLogo && (
          <div className={styles.headerLeft}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>SS</div>
            </div>
          </div>
        )}
        <nav className={styles.topNav}>
          <a
            href="/news"
            className={`${styles.topNavItem} ${activeNav === 'news' ? styles.topNavItemActive : ''}`}
          >
            NEWS
          </a>
          <a
            href="/company"
            className={`${styles.topNavItem} ${activeNav === 'company' ? styles.topNavItemActive : ''}`}
          >
            COMPANY
          </a>
          <a
            href="/aillm"
            className={`${styles.topNavItem} ${activeNav === 'aillm' ? styles.topNavItemActive : ''}`}
          >
            AI LLM
          </a>
          <div
            className={styles.rpaNavItemWrapper}
            onMouseEnter={() => setShowNotificationPopup(true)}
            onMouseLeave={() => setShowNotificationPopup(false)}
          >
            <a
              href="/rpa"
              className={`${styles.topNavItem} ${activeNav === 'rpa' ? styles.topNavItemActive : ''}`}
            >
              RPA
              {unreadCount > 0 && (
                <span className={styles.notificationDot} aria-label={`${unreadCount}개의 읽지 않은 알림`}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </a>
            {showNotificationPopup && unreadCount > 0 && (
              <div className={styles.notificationPopup}>
                <div className={styles.notificationPopupHeader}>
                  <h3>RPA 알림 ({unreadCount})</h3>
                  <button
                    className={styles.markAllReadButton}
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        const response = await fetch('/api/rpa/notifications', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ markAllAsRead: true })
                        });
                        if (response.ok) {
                          fetchRpaNotifications();
                        }
                      } catch (error) {
                        console.error('Failed to mark all as read:', error);
                      }
                    }}
                  >
                    모두 읽음
                  </button>
                </div>
                <div className={styles.notificationList}>
                  {rpaNotifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      className={`${styles.notificationItem} ${!notification.read ? styles.notificationItemUnread : ''}`}
                      onClick={async () => {
                        if (notification.projectId) {
                          window.location.href = `/rpa/${notification.projectId}`;
                        }
                      }}
                    >
                      <div className={styles.notificationItemContent}>
                        <div className={styles.notificationItemTitle}>{notification.title}</div>
                        <div className={styles.notificationItemMessage}>{notification.message}</div>
                        <div className={styles.notificationItemTime}>
                          {new Date(notification.createdAt).toLocaleString('ko-KR', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  {rpaNotifications.length === 0 && (
                    <div className={styles.notificationEmpty}>알림이 없습니다.</div>
                  )}
                </div>
                {rpaNotifications.length > 10 && (
                  <div className={styles.notificationFooter}>
                    <a href="/rpa" className={styles.viewAllLink}>
                      모든 알림 보기
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
          <a
            href="/inquiry"
            className={`${styles.topNavItem} ${activeNav === 'inquiry' ? styles.topNavItemActive : ''}`}
          >
            INQUIRY
          </a>
          <a
            href="/setting"
            className={`${styles.topNavItem} ${activeNav === 'settings' ? styles.topNavItemActive : ''}`}
          >
            SETTING
          </a>
          <a
            href="/mypage"
            className={`${styles.topNavItem} ${activeNav === 'mypage' ? styles.topNavItemActive : ''}`}
          >
            MYPAGE
          </a>
        </nav>
        <div className={styles.headerRight}>
          {isLoggedIn ? (
            <button onClick={handleLogout} className={styles.loginButton} style={{ cursor: 'pointer', border: 'none', background: 'none' }}>
              로그아웃
            </button>
          ) : (
            onLoginClick ? (
              <button onClick={onLoginClick} className={styles.loginButton} style={{ cursor: 'pointer', border: 'none', background: 'none' }}>
                로그인
              </button>
            ) : (
              <Link href="/login" className={styles.loginButton}>
                로그인
              </Link>
            )
          )}
          {headerActions && headerActions}
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main} style={mainFlexStyle}>
        {/* Page Title Header */}
        {title && (
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{title}</h1>
          </div>
        )}

        {/* Content Area */}
        <div className={styles.content}>{children}</div>
      </main>

      {/* Footer */}
      <footer className={styles.footer} style={footerStyle}>
        <div className={styles.footerInner} style={footerInnerStyle}>
          <div className={styles.footerBrand} style={footerBrandStyle}>
            <div className={styles.footerLogoRow} style={footerLogoRowStyle}>
              <span className={styles.footerLogoIcon} style={footerLogoIconStyle}>
                SS
              </span>
              <span className={styles.footerLogoText}>시와소프트</span>
            </div>
            <div className={styles.footerMeta} style={footerMetaStyle}>
              © {year} 시와소프트. All rights reserved.
            </div>
          </div>

          <nav className={styles.footerLinks} style={footerLinksStyle} aria-label="Footer">
            <a href="/company" className={styles.footerLink} style={footerLinkStyle}>
              회사소개
            </a>
            <a href="/inquiry" className={styles.footerLink} style={footerLinkStyle}>
              문의하기
            </a>

          </nav>
        </div>
      </footer>
    </div>
  );
}

