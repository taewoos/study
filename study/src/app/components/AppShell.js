'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function AppShell({ styles, title, activeNav, headerActions, children, showLogo = true }) {
  const year = new Date().getFullYear();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 로그인 상태 확인 (localStorage 또는 sessionStorage에서 확인)
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    
    checkLoginStatus();
    // 로그인 상태 변경 감지를 위한 이벤트 리스너 (선택사항)
    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

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
    background: '#ffffff',
    borderTop: '1px solid #e5e5e5',
    padding: '24px 32px',
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
              <span className={styles.logoText}>시와소프트</span>
            </div>
          </div>
        )}
        <nav className={styles.topNav}>
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
          <a
            href="/aiocr"
            className={`${styles.topNavItem} ${activeNav === 'ocr' ? styles.topNavItemActive : ''}`}
          >
            AI OCR
          </a>
          <a
            href="/rpa"
            className={`${styles.topNavItem} ${activeNav === 'rpa' ? styles.topNavItemActive : ''}`}
          >
            RPA
          </a>
          <a
            href="/inquiry"
            className={`${styles.topNavItem} ${activeNav === 'inquiry' ? styles.topNavItemActive : ''}`}
          >
            INQUIRY
          </a>
          <a
            href="/settings"
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
          {!isLoggedIn && (
            <Link href="/login" className={styles.loginButton}>
              로그인
            </Link>
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
            <a href="/settings" className={styles.footerLink} style={footerLinkStyle}>
              설정
            </a>
            <a href="/mypage" className={styles.footerLink} style={footerLinkStyle}>
              마이페이지
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

