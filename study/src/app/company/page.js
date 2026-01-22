'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { AppShell } from '../components/AppShell';

const sloganTexts = [
  'Agent 사용으로 생산성 Up',
  'AI로 업무 자동화 실현',
  '스마트한 디지털 전환',
  '효율적인 업무 프로세스',
  '혁신적인 AI 솔루션',
  '지능형 자동화 시스템',
  '빠르고 정확한 처리',
  '비즈니스 성장 가속화',
  '차세대 AI 기술',
  '업무 혁신의 시작'
];

const featureDescriptions = {
  'aillm': {
    title: 'Ai LLM',
    description: [
      '대규모 언어 모델을 활용한 지능형 AI 솔루션입니다.',
      '자연어 처리와 대화형 인터페이스를 통해 복잡한 업무를 간단하게 처리할 수 있습니다.',
      '문서 작성, 번역, 요약, 질의응답 등 다양한 업무에 활용 가능합니다.',
      '실시간 학습과 개인화된 응답으로 업무 효율성을 극대화합니다.'
    ]
  },
  'aiagent': {
    title: 'Ai Agent',
    description: [
      '지능형 AI 에이전트로 업무 자동화를 한 단계 업그레이드합니다.',
      '복잡한 작업을 자동으로 분석하고 실행하여 시간을 절약합니다.',
      '다양한 시스템과 연동하여 통합적인 업무 처리가 가능합니다.',
      '학습 기능을 통해 지속적으로 성능이 향상됩니다.'
    ]
  },
  'aiocr': {
    title: 'Ai OCR',
    description: [
      '고정밀 AI 기반 문서 인식 기술로 모든 문서를 디지털화합니다.',
      '이미지, PDF, 스캔 문서 등 다양한 형식을 정확하게 인식합니다.',
      '자동 데이터 추출 및 구조화로 수작업을 대폭 줄입니다.',
      '다국어 지원과 다양한 문서 형식을 처리할 수 있습니다.'
    ]
  },
  'finetuning': {
    title: 'Fine-tuning',
    description: [
      '사용자 맞춤형 AI 모델을 위한 파인튜닝 서비스를 제공합니다.',
      '특정 도메인과 업무에 최적화된 모델을 구축할 수 있습니다.',
      '고품질 데이터로 모델의 정확도와 성능을 향상시킵니다.',
      '지속적인 학습과 개선을 통해 최적의 솔루션을 제공합니다.'
    ]
  },
  'rpa': {
    title: 'RPA',
    description: [
      '로봇 프로세스 자동화로 반복적인 업무를 완전 자동화합니다.',
      '규칙 기반 작업을 정확하고 빠르게 처리하여 인적 오류를 방지합니다.',
      '24시간 무인 운영으로 업무 처리량을 극대화합니다.',
      '기존 시스템과의 원활한 통합으로 즉시 활용 가능합니다.'
    ]
  },
  'modelcustom': {
    title: 'Model Custom',
    description: [
      '고객 맞춤형 AI 모델 개발 서비스를 제공합니다.',
      '비즈니스 요구사항에 맞는 전용 모델을 설계하고 구축합니다.',
      '데이터 분석부터 모델 배포까지 전 과정을 지원합니다.',
      '최신 AI 기술을 활용한 혁신적인 솔루션을 제공합니다.'
    ]
  }
};

export default function CompanyPage() {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [floatingTexts, setFloatingTexts] = useState([]);

  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature);
  };

  useEffect(() => {
    const createFloatingText = () => {
      const randomText = sloganTexts[Math.floor(Math.random() * sloganTexts.length)];
      // 슬로건 텍스트 영역을 피한 위치 (상단 20%와 하단 30% 영역)
      const top = Math.random() < 0.5 
        ? Math.random() * 15 + 5  // 상단 5% ~ 20%
        : Math.random() * 25 + 70; // 하단 70% ~ 95%
      return {
        id: Math.random(),
        text: randomText,
        displayedText: '',
        left: Math.random() * 70 + 15, // 15% ~ 85%
        top: top,
        delay: Math.random() * 300,
        isTyping: true,
      };
    };

    // 초기 2개 생성
    const initialTexts = [createFloatingText(), createFloatingText()];
    setFloatingTexts(initialTexts);

    // 타자 효과를 위한 인터벌
    const typingInterval = setInterval(() => {
      setFloatingTexts((prev) => {
        return prev.map((item) => {
          if (item.isTyping && item.displayedText.length < item.text.length) {
            return {
              ...item,
              displayedText: item.text.substring(0, item.displayedText.length + 1),
            };
          } else if (item.isTyping) {
            return {
              ...item,
              isTyping: false,
            };
          }
          return item;
        });
      });
    }, 100);

    // 주기적으로 텍스트 교체
    const replaceInterval = setInterval(() => {
      setFloatingTexts((prev) => {
        // 하나 제거하고 새로 추가
        const newTexts = prev.slice(1);
        newTexts.push(createFloatingText());
        return newTexts;
      });
    }, 3000);

    return () => {
      clearInterval(typingInterval);
      clearInterval(replaceInterval);
    };
  }, []);

  return (
    <AppShell styles={styles} title="" activeNav="company" headerActions={null} showLogo={false}>
      {/* 상단 슬로건 영역 - GPT 스타일 */}
      <div className={styles.sloganSection}>
        {floatingTexts.map((item) => (
          <div
            key={item.id}
            className={styles.floatingText}
            style={{
              left: `${item.left}%`,
              top: `${item.top}%`,
              animationDelay: `${item.delay}ms`,
            }}
          >
            {item.displayedText}
            {item.isTyping && <span className={styles.cursor}>|</span>}
          </div>
        ))}
        <div className={styles.sloganContent}>
          <h1 className={styles.sloganMain}>
            AI 기반 자동화 솔루션으로<br />
            <span className={styles.sloganHighlight}>생산성을 높이고</span> 업무의 새로운 경험을 제공합니다
          </h1>
          <p className={styles.sloganSubtext}>
            가장 똑똑하고 빠르고 실용적인 AI 모델이 탑재되어 더욱 깊이 있게 사고합니다. 이제 누구나 사용할 수 있습니다.
          </p>
          <div className={styles.sloganActions}>
            <Link href="/aillm" className={styles.sloganButtonPrimary}>시작하기 <span className={styles.chevron}>›</span></Link>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className={styles.mainContentSection}>
        <div className={styles.mainContentContainer}>
          <h2 className={styles.mainDescriptionTitle}>Custom Ai 제공되는 다양기능을 만나보세요</h2>
          <div className={styles.featureCardsGrid}>
            <div className={styles.featureCard} onClick={() => handleFeatureClick('aillm')}>
              <div className={styles.featureCardImage}>
                <img src="/uploads/aillm.png" alt="Ai LLM" />
                <div className={styles.featureCardText}>
                  <h3 className={styles.featureCardTitle}>Ai LLM</h3>
                  <p className={styles.featureCardDescription}>대규모 언어 모델을 활용한 지능형 AI 솔루션</p>
                </div>
              </div>
            </div>
            <div className={styles.featureCard} onClick={() => handleFeatureClick('aiagent')}>
              <div className={styles.featureCardImage}>
                <img src="https://via.placeholder.com/300x200/50C878/ffffff?text=Ai+Agent" alt="Ai Agent" />
              </div>
              <div className={styles.featureCardText}>
                <h3 className={styles.featureCardTitle}>Ai Agent</h3>
              </div>
            </div>
            <div className={styles.featureCard} onClick={() => handleFeatureClick('aiocr')}>
              <div className={styles.featureCardImage}>
                <img src="https://via.placeholder.com/300x200/FF6B6B/ffffff?text=Ai+OCR" alt="Ai OCR" />
              </div>
              <div className={styles.featureCardText}>
                <h3 className={styles.featureCardTitle}>Ai OCR</h3>
              </div>
            </div>
            <div className={styles.featureCard} onClick={() => handleFeatureClick('finetuning')}>
              <div className={styles.featureCardImage}>
                <img src="https://via.placeholder.com/300x200/9B59B6/ffffff?text=Fine-tuning" alt="Fine-tuning" />
              </div>
              <div className={styles.featureCardText}>
                <h3 className={styles.featureCardTitle}>Fine-tuning</h3>
              </div>
            </div>
            <div className={styles.featureCard} onClick={() => handleFeatureClick('rpa')}>
              <div className={styles.featureCardImage}>
                <img src="https://via.placeholder.com/300x200/F39C12/ffffff?text=RPA" alt="RPA" />
              </div>
              <div className={styles.featureCardText}>
                <h3 className={styles.featureCardTitle}>RPA</h3>
              </div>
            </div>
            <div className={styles.featureCard} onClick={() => handleFeatureClick('modelcustom')}>
              <div className={styles.featureCardImage}>
                <img src="https://via.placeholder.com/300x200/1ABC9C/ffffff?text=Model+Custom" alt="Model Custom" />
              </div>
              <div className={styles.featureCardText}>
                <h3 className={styles.featureCardTitle}>Model Custom</h3>
              </div>
            </div>
          </div>

          {/* Modal */}
          {selectedFeature && (
            <>
              <div 
                className={styles.modalOverlay}
                onClick={() => setSelectedFeature(null)}
              />
              <div className={styles.modal}>
                <button 
                  className={styles.modalCloseButton}
                  onClick={() => setSelectedFeature(null)}
                >
                  ×
                </button>
                <div className={styles.modalContent}>
                  <h2 className={styles.modalTitle}>
                    {selectedFeature === 'aillm' && 'Ai LLM'}
                    {selectedFeature === 'aiagent' && 'Ai Agent'}
                    {selectedFeature === 'aiocr' && 'Ai OCR'}
                    {selectedFeature === 'finetuning' && 'Fine-tuning'}
                    {selectedFeature === 'rpa' && 'RPA'}
                    {selectedFeature === 'modelcustom' && 'Model Custom'}
                  </h2>
                  <div className={styles.modalBody}>
                    <p>이곳에 상세 설명이 들어갈 예정입니다.</p>
                    <p>각 기능에 대한 자세한 내용을 여기에 작성하실 수 있습니다.</p>
                    <p>추가 정보나 설명을 원하는 만큼 추가할 수 있습니다.</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 하단 3개 박스 */}
      <div className={styles.bottomFeaturesSection}>
        <div className={styles.bottomFeaturesGrid}>
          <div className={styles.bottomFeatureBox}>
            <h4 className={styles.bottomFeatureTitle}>RPA</h4>
            <p className={styles.bottomFeatureDesc}>로봇 프로세스 자동화</p>
          </div>
          <div className={styles.bottomFeatureBox}>
            <h4 className={styles.bottomFeatureTitle}>AI LLM</h4>
            <p className={styles.bottomFeatureDesc}>대규모 언어 모델</p>
          </div>
          <div className={styles.bottomFeatureBox}>
            <h4 className={styles.bottomFeatureTitle}>AI OCR</h4>
            <p className={styles.bottomFeatureDesc}>문서 인식 기술</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
