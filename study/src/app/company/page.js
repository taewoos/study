'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { AppShell } from '../components/AppShell';

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
  'rpa': {
    title: 'RPA',
    description: [
      '로봇 프로세스 자동화로 반복적인 업무를 완전 자동화합니다.',
      '규칙 기반 작업을 정확하고 빠르게 처리하여 인적 오류를 방지합니다.',
      '24시간 무인 운영으로 업무 처리량을 극대화합니다.',
      '기존 시스템과의 원활한 통합으로 즉시 활용 가능합니다.'
    ]
  }
};

export default function CompanyPage() {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature);
  };

  return (
    <AppShell styles={styles} title="" activeNav="company" headerActions={null} showLogo={false}>
      {/* 상단 슬로건 영역 - GPT 스타일 */}
      <div className={styles.sloganSection}>
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
            <a href="#" className={styles.sloganLink}>자세히 알아보기 <span className={styles.chevron}>›</span></a>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className={styles.mainContentSection}>
        <div className={styles.mainContentContainer}>
          <div className={styles.mainDescription}>
            {!selectedFeature ? (
              <>
                <h2 className={styles.mainDescriptionTitle}>Custom Ai 제공되는 다양기능을 만나보세요</h2>
                <div className={styles.featureButtons}>
                  <button onClick={() => handleFeatureClick('aillm')} className={styles.featureButton}>
                    <span className={styles.featureNumber}>1.</span>
                    <span className={styles.featureName}>Ai LLM</span>
                  </button>
                  <button onClick={() => handleFeatureClick('aiagent')} className={styles.featureButton}>
                    <span className={styles.featureNumber}>2.</span>
                    <span className={styles.featureName}>Ai Agent</span>
                  </button>
                  <button onClick={() => handleFeatureClick('aiocr')} className={styles.featureButton}>
                    <span className={styles.featureNumber}>3.</span>
                    <span className={styles.featureName}>Ai OCR</span>
                  </button>
                  <button onClick={() => handleFeatureClick('rpa')} className={styles.featureButton}>
                    <span className={styles.featureNumber}>4.</span>
                    <span className={styles.featureName}>RPA</span>
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.featureContent}>
                <div className={styles.featureContentHeader}>
                  <button onClick={() => setSelectedFeature(null)} className={styles.backButton}>
                    ← 돌아가기
                  </button>
                  <h2 className={styles.featureContentTitle}>{featureDescriptions[selectedFeature].title}</h2>
                </div>
                <div className={styles.featureContentBody}>
                  {featureDescriptions[selectedFeature].description.map((text, index) => (
                    <p key={index} className={styles.featureContentText}>{text}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
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
