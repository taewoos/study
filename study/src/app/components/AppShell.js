'use client';

export function AppShell({ styles, title, activeNav, headerActions, children }) {
  return (
    <div className={styles.container}>
      {/* Top Header with Navigation */}
      <header className={styles.topHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>SS</div>
            <span className={styles.logoText}>시와소프트</span>
          </div>
        </div>
        <nav className={styles.topNav}>
          <a
            href="/home"
            className={`${styles.topNavItem} ${activeNav === 'home' ? styles.topNavItemActive : ''}`}
          >
            HOME
          </a>
          <a
            href="/rpa"
            className={`${styles.topNavItem} ${activeNav === 'rpa' ? styles.topNavItemActive : ''}`}
          >
            RPA
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
        </nav>
        <div className={styles.headerRight}>
          {headerActions}
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Page Title Header */}
        {title && (
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{title}</h1>
          </div>
        )}

        {/* Content Area */}
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}

