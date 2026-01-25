'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: email, // 이메일 또는 아이디로 로그인 가능
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 로그인 성공 - JWT 토큰 저장
        if (data.token) {
          localStorage.setItem('token', data.token);
          sessionStorage.setItem('token', data.token);
        }
        // 사용자 정보도 저장 (UI 표시용)
        localStorage.setItem('user', JSON.stringify(data.user));
        sessionStorage.setItem('user', JSON.stringify(data.user));
        
        // 로그인 상태 변경 이벤트 발생
        window.dispatchEvent(new Event('loginStatusChange'));
        
        alert('로그인 성공!');
        // 메인 페이지로 이동
        window.location.href = '/company';
      } else {
        alert(data.error || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        {/* Close Button */}
        <button className={styles.closeButton} aria-label="Close">
          <svg className={styles.closeIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path className={styles.closeIconPath} d="M18 6L6 18M6 6L18 18"/>
          </svg>
        </button>

        {/* Logo Section */}
        <div className={styles.logoSection}>
          <div className={styles.logoPlaceholder}>
            {/* 로고 이미지를 여기에 추가하세요 */}
            <span>LOGO</span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className={styles.socialLogin}>
          <button className={styles.socialButton}>
            <div className={`${styles.socialIcon} ${styles.naver}`}>
              <span>N</span>
            </div>
            <span className={styles.socialLabel}>네이버</span>
          </button>
          <button className={styles.socialButton}>
            <div className={`${styles.socialIcon} ${styles.kakao}`}>
              <svg className={styles.socialSvgIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path className={styles.kakaoIconPath} d="M12 3C6.48 3 2 6.48 2 11c0 2.65 1.36 5.01 3.44 6.36L4 22l4.64-1.44C9.99 22.64 10.99 23 12 23c5.52 0 10-3.48 10-8s-4.48-8-10-8z"/>
              </svg>
            </div>
            <span className={styles.socialLabel}>카카오</span>
          </button>
          <button className={styles.socialButton}>
            <div className={`${styles.socialIcon} ${styles.google}`}>
              <svg className={styles.socialSvgIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path className={styles.googleIconPath1} d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path className={styles.googleIconPath2} d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path className={styles.googleIconPath3} d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path className={styles.googleIconPath4} d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <span className={styles.socialLabel}>구글</span>
          </button>
        </div>

        {/* Divider */}
        <div className={styles.divider}>
          <span className={styles.dividerText}>or</span>
        </div>

        {/* Email Input */}
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            id="email"
            type="email"
            className={styles.input}
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Input */}
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <div className={styles.passwordWrapper}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={styles.input}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <svg className={styles.passwordToggleIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {showPassword ? (
                  <>
                    <path className={styles.passwordTogglePath} d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle className={styles.passwordTogglePath} cx="12" cy="12" r="3"/>
                  </>
                ) : (
                  <>
                    <path className={styles.passwordTogglePath} d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line className={styles.passwordTogglePath} x1="1" y1="1" x2="23" y2="23"/>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Sign In Button */}
        <button 
          className={styles.signInButton}
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? '로그인 중...' : 'Sign In'}
        </button>

        {/* Forgot Password Link */}
        <div className={styles.forgotPassword}>
          <span>Forgot password? </span>
          <a href="#" className={styles.resetLink}>Reset it here</a>
        </div>

        {/* Create Free Account Button */}
        <Link href="/signup" className={styles.createAccountButton}>
          Create Free Account
        </Link>
      </div>
    </div>
  );
}
