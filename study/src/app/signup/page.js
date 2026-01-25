'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [company, setCompany] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleVerifyEmail = () => {
    // 이메일 인증 로직 (실제 구현 필요)
    setIsCodeSent(true);
    // 인증번호 전송 API 호출
  };

  const handleVerifyCode = () => {
    // 인증번호 확인 로직 (실제 구현 필요)
    setIsEmailVerified(true);
    // 인증번호 확인 API 호출
  };

  const handleSignup = async () => {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          userId,
          password,
          company,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('회원가입이 완료되었습니다!');
        // 로그인 페이지로 이동
        window.location.href = '/login';
      } else {
        alert(data.error || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        {/* Close Button */}
        <Link href="/login" className={styles.closeButton} aria-label="Close">
          <svg className={styles.closeIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path className={styles.closeIconPath} d="M18 6L6 18M6 6L18 18"/>
          </svg>
        </Link>

        {/* Title Section */}
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Custom AI</h1>
        </div>

        {/* Name Input */}
        <div className={styles.inputGroup}>
          <label htmlFor="name" className={styles.label}>name</label>
          <input
            id="name"
            type="text"
            className={styles.input}
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email Input with Verify Button */}
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <div className={styles.emailWrapper}>
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isEmailVerified}
            />
            <button
              type="button"
              className={styles.verifyButton}
              onClick={handleVerifyEmail}
              disabled={!email || isEmailVerified}
            >
              {isEmailVerified ? '인증완료' : '인증하기'}
            </button>
          </div>
        </div>

        {/* Verification Code Input */}
        {isCodeSent && !isEmailVerified && (
          <div className={styles.inputGroup}>
            <label htmlFor="verificationCode" className={styles.label}>인증번호</label>
            <div className={styles.codeWrapper}>
              <input
                id="verificationCode"
                type="text"
                className={styles.input}
                placeholder="인증번호를 입력하세요"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <button
                type="button"
                className={styles.verifyCodeButton}
                onClick={handleVerifyCode}
                disabled={!verificationCode}
              >
                확인
              </button>
            </div>
          </div>
        )}

        {/* User ID Input */}
        <div className={styles.inputGroup}>
          <label htmlFor="userId" className={styles.label}>ID</label>
          <input
            id="userId"
            type="text"
            className={styles.input}
            placeholder="아이디를 입력하세요"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>

        {/* Password Input */}
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>password</label>
          <div className={styles.passwordWrapper}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={styles.input}
              placeholder="비밀번호를 입력하세요"
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

        {/* Confirm Password Input */}
        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>password</label>
          <div className={styles.passwordWrapper}>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              className={styles.input}
              placeholder="비밀번호를 다시 입력하세요"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              <svg className={styles.passwordToggleIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {showConfirmPassword ? (
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

        {/* Company Input */}
        <div className={styles.inputGroup}>
          <label htmlFor="company" className={styles.label}>Company</label>
          <input
            id="company"
            type="text"
            className={styles.input}
            placeholder="회사명을 입력하세요"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        {/* Terms Agreement */}
        <div className={styles.termsGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
            />
            <span className={styles.checkboxText}>
              <button
                type="button"
                className={styles.termsLink}
                onClick={(e) => {
                  e.preventDefault();
                  setShowTermsModal(true);
                }}
              >
                이용약관
              </button>
              에 동의합니다
            </span>
          </label>
        </div>

        {/* Sign Up Button */}
        <button 
          className={styles.signUpButton}
          onClick={handleSignup}
          disabled={!name || !email || !isEmailVerified || !userId || !password || !confirmPassword || password !== confirmPassword || !company || !agreeToTerms}
        >
          가입하기
        </button>

        {/* Login Link */}
        <div className={styles.loginLink}>
          <span>이미 계정이 있으신가요? </span>
          <Link href="/login" className={styles.loginLinkText}>로그인</Link>
        </div>
      </div>

      {/* Terms Modal */}
      {showTermsModal && (
        <>
          <div 
            className={styles.modalOverlay}
            onClick={() => setShowTermsModal(false)}
          />
          <div className={styles.termsModal}>
            <div className={styles.termsModalHeader}>
              <h2 className={styles.termsModalTitle}>이용약관</h2>
              <button
                className={styles.termsModalClose}
                onClick={() => setShowTermsModal(false)}
                aria-label="Close"
              >
                <svg className={styles.closeIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path className={styles.closeIconPath} d="M18 6L6 18M6 6L18 18"/>
                </svg>
              </button>
            </div>
            <div className={styles.termsModalContent}>
              <h3>제1조 (목적)</h3>
              <p>이 약관은 Custom AI(이하 "회사")가 제공하는 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
              
              <h3>제2조 (정의)</h3>
              <p>1. "서비스"란 회사가 제공하는 AI 기반 자동화 솔루션 및 관련 서비스를 의미합니다.</p>
              <p>2. "이용자"란 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 의미합니다.</p>
              <p>3. "회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며, 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 의미합니다.</p>
              
              <h3>제3조 (약관의 게시와 개정)</h3>
              <p>1. 회사는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.</p>
              <p>2. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</p>
              
              <h3>제4조 (서비스의 제공 및 변경)</h3>
              <p>1. 회사는 다음과 같은 서비스를 제공합니다:</p>
              <ul>
                <li>AI LLM 서비스</li>
                <li>AI Agent 서비스</li>
                <li>AI OCR 서비스</li>
                <li>RPA 서비스</li>
                <li>Fine-tuning 서비스</li>
                <li>기타 회사가 추가 개발하거나 제휴계약 등을 통해 이용자에게 제공하는 일체의 서비스</li>
              </ul>
              
              <h3>제5조 (회원가입)</h3>
              <p>1. 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.</p>
              <p>2. 회사는 제1항과 같이 회원가입을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다:</p>
              <ul>
                <li>가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
                <li>기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</li>
              </ul>
              
              <h3>제6조 (개인정보보호)</h3>
              <p>회사는 이용자의 개인정보 수집시 서비스제공을 위하여 필요한 범위에서 최소한의 개인정보를 수집합니다.</p>
              
              <h3>제7조 (회원의 의무)</h3>
              <p>1. 회원은 다음 행위를 하여서는 안 됩니다:</p>
              <ul>
                <li>신청 또는 변경시 허위내용의 등록</li>
                <li>타인의 정보 도용</li>
                <li>회사가 게시한 정보의 변경</li>
                <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                <li>회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 공개 또는 게시하는 행위</li>
              </ul>
            </div>
            <div className={styles.termsModalFooter}>
              <button
                className={styles.termsModalAgreeButton}
                onClick={() => {
                  setAgreeToTerms(true);
                  setShowTermsModal(false);
                }}
              >
                동의합니다
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
