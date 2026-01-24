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

const pricingPlans = [
  {
    key: 'starter',
    name: 'Starter',
    price: '₩49,000',
    period: '/월',
    description: '개인/소규모 팀을 위한 시작 플랜',
    features: ['기본 LLM 기능', '문서 요약/번역', '기본 템플릿', '이메일 지원'],
    tone: 'pink',
  },
  {
    key: 'pro',
    name: 'Pro',
    price: '₩149,000',
    period: '/월',
    description: '업무 자동화를 본격적으로 확장',
    features: ['고급 LLM 기능', '워크플로우 자동화', '팀 공유/권한', '우선 지원'],
    tone: 'blue',
    highlight: true,
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    price: '문의',
    period: '',
    description: '보안/연동/커스텀 요구사항 대응',
    features: ['온프레미스/전용 배포', 'SSO/권한관리', '커스텀 모델/파인튜닝', '전담 지원'],
    tone: 'purple',
  },
];

const newsItems = [
  {
    title: 'Custom AI, 업무 자동화 솔루션 고도화',
    date: '2026-01-01',
    excerpt: 'LLM 기반 문서 처리와 워크플로우 자동화를 결합해 운영 효율을 개선했습니다.',
    href: '#',
  },
  {
    title: 'AI OCR 적용으로 입력 업무 70% 절감',
    date: '2025-12-12',
    excerpt: '문서 인식 정확도를 높이고 예외 케이스 처리 시간을 단축했습니다.',
    href: '#',
  },
  {
    title: 'RPA + Agent 도입 사례 공개',
    date: '2025-11-20',
    excerpt: '반복 업무를 자동화하고 승인/보고 흐름을 표준화했습니다.',
    href: '#',
  },
];

const credentialItems = [
  { title: '특허 등록', subtitle: '문서 자동 분류 방법', imageSrc: '/uploads/aillm.png' },
  { title: '특허 출원', subtitle: '워크플로우 추천 엔진', imageSrc: '/uploads/aillm.png' },
  { title: '자격증', subtitle: '정보보안/클라우드', imageSrc: '/uploads/aillm.png' },
  { title: '인증', subtitle: '품질/ISMS 준비', imageSrc: '/uploads/aillm.png' },
];

const aiAgentDefinitionSteps = ['목표를 입력받아', '계획', '도구 호출', '상태 갱신', '평가/수정', '자율 실행 루프'];
const aiAgentDemoVideoSrc = '/uploads/aiagent-demo.mp4';

const aiAgentUseCases = [
  {
    title: '세금 계산서 발행 Agent',
    desc: '설명할 내용 정리중',
    videoSrc: '/uploads/aiagent-case-01.mp4',
    arch: {
      diagramSrc: '/uploads/세금계산서발행.png',
      // Diagram reference: ERP data→embedding(VectorDB) → intent agent → (issue/modify invoice) → user confirm → RPA 실행/ERP 수정
      flow: [
        'ERP Data 수집·임베딩 (Vector DB 저장)',
        '사용자 명령',
        '사용자 의도 분류',
        '의도분류 Agent: 세금계산서 발행/수정',
        '세금계산서 발행(안) 생성',
        '사용자 confirm',
        '세금계산서 발행 실행(RPA 자동화)',
        'ERP 계산서 내역 수정(RPA 자동화)',
        '감사/로그',
      ],
      components: [
        'ERP/회계 시스템',
        '전처리 파이프라인(수집/정제)',
        '임베딩 모델',
        'Vector DB(RAG 인덱스)',
        'LLM(의도분류 Agent + 응답/플랜)',
        '사용자 확인(HITL)',
        'RPA 실행기(발행/수정 자동화)',
        '감사 로그/모니터링',
      ],
    },
  },
  {
    title: '문서 전처리 Aget',
    desc: '설명할 내용 정리중',
    videoSrc: '/uploads/aiagent-case-02.mp4',
    arch: {
      diagramSrc: '/uploads/문서.png',
      flow: ['업로드', 'OCR/파싱', '정합성 검사', '태깅/분류', '저장/인덱싱'],
      components: ['Agent Orchestrator(LLM)', 'OCR 엔진', '파일 스토리지', '메타데이터 DB', '검색 인덱스(Vector/Keyword)', '품질/오류 리포트'],
    },
  },
  {
    title: '문서·계약 검토 보조',
    desc: '설명할 내용 정리중',
    videoSrc: '/uploads/aiagent-case-03.mp4',
    arch: {
      flow: ['문서 업로드', '조항 추출', '근거 검색(RAG)', '리스크 체크', '리포트 생성'],
      components: ['Agent Orchestrator(LLM)', '문서 파서', '정책/템플릿 지식베이스', 'RAG 검색', 'HITL 검토(옵션)', '결과 리포트/다운로드'],
    },
  },
  {
    title: '내부 지식 검색/정리',
    desc: '설명할 내용 정리중',
    videoSrc: '/uploads/aiagent-case-04.mp4',
    arch: {
      flow: ['질문', '문서 검색', '근거 요약', '답변 생성', '업무 생성/공유'],
      components: ['Agent Orchestrator(LLM)', '사내 문서 커넥터(Drive/Notion/Wiki)', '검색 인덱스(RAG)', '권한 필터', '슬랙/메일 공유', '대화 로그/피드백'],
    },
  },
  {
    title: '보고서·회의록 자동 생성',
    desc: '설명할 내용 정리중.',
    videoSrc: '/uploads/aiagent-case-05.mp4',
    arch: {
      flow: ['데이터 수집', '요약/분석', '템플릿 채움', '검토', '배포/공유'],
      components: ['Agent Orchestrator(LLM)', '데이터 소스(API/DB)', '리포트 템플릿', 'HITL 검토(옵션)', 'PDF/문서 생성기', '공유(메일/드라이브)'],
    },
  },
  {
    title: '시스템 연동 업무 자동화',
    desc: '설명할 내용 정리중',
    videoSrc: '/uploads/aiagent-case-06.mp4',
    arch: {
      flow: ['이벤트(Webhook)', '계획/분기', '도구 실행', '상태 업데이트', '알림/리포트'],
      components: ['Agent Orchestrator(LLM)', 'Workflow 엔진', '외부 시스템 커넥터(CRM/ERP/Slack)', '재시도/큐(옵션)', '감사 로그', '모니터링'],
    },
  },
];

export default function CompanyPage() {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [activeAiAgentUseCaseIndex, setActiveAiAgentUseCaseIndex] = useState(0);

  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature);
    if (feature === 'aiagent') {
      setActiveAiAgentUseCaseIndex(0);
    }
  };

  const renderModalBody = () => {
    if (!selectedFeature) return null;

    if (selectedFeature === 'aiagent') {
      const activeUseCase =
        aiAgentUseCases[activeAiAgentUseCaseIndex] || aiAgentUseCases[0];
      const activeVideoSrc = activeUseCase?.videoSrc || aiAgentDemoVideoSrc;
      const activeArch = activeUseCase?.arch || {
        diagramSrc: '',
        flow: ['입력', '계획', '도구 호출', '상태 갱신', '완료'],
        components: ['Agent Orchestrator(LLM)', 'Tool/API', 'DB/Storage', 'Auth/Policy', 'Observability'],
      };

      return (
        <>
          <h3>정의 및 구성요소</h3>
          <div className={styles.agentStepper} aria-label="AI Agent loop steps">
            {aiAgentDefinitionSteps.map((step) => (
              <div key={step} className={styles.agentStep}>
                {step}
              </div>
            ))}
          </div>

          <h3>Agent 사용 예시</h3>
          <div className={styles.useCaseGrid}>
            {aiAgentUseCases.map((c, idx) => (
              <button
                key={c.title}
                type="button"
                className={`${styles.useCaseCard} ${idx === activeAiAgentUseCaseIndex ? styles.useCaseCardActive : ''}`}
                onClick={() => setActiveAiAgentUseCaseIndex(idx)}
                aria-pressed={idx === activeAiAgentUseCaseIndex}
              >
                <div className={styles.useCaseTitle}>{c.title}</div>
                <div className={styles.useCaseDesc}>{c.desc}</div>
              </button>
            ))}
          </div>

          <h3>사용 예시 영상</h3>
          <div className={styles.modalVideoTitle}>
            선택된 예시: <strong>{activeUseCase?.title}</strong>
          </div>
          <div className={styles.modalVideoWrap}>
            <video
              key={activeVideoSrc}
              className={styles.modalVideo}
              controls
              playsInline
              preload="metadata"
            >
              <source src={activeVideoSrc} type="video/mp4" />
              브라우저가 video 태그를 지원하지 않습니다.
            </video>
          </div>

          <h3>아키텍처</h3>
          <div className={styles.agentArchWrap}>
            <div className={styles.agentArchHeader}>
              <div className={styles.agentArchHeaderTitle}>{activeUseCase?.title}</div>
              <div className={styles.agentArchHeaderSub}>선택된 예시에 따라 구성/흐름이 바뀝니다.</div>
            </div>

            <div className={styles.agentArchGrid}>
              <div className={styles.agentArchPanel}>
                <div className={styles.agentArchPanelTitle}>Flow</div>
                {activeArch.diagramSrc ? (
                  <div className={styles.agentArchDiagramWrap}>
                    <a
                      className={styles.agentArchDiagramLink}
                      href={activeArch.diagramSrc}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        className={styles.agentArchDiagram}
                        src={activeArch.diagramSrc}
                        alt={`${activeUseCase?.title || 'AI Agent'} 플로우 다이어그램`}
                      />
                    </a>
                    <div className={styles.agentArchDiagramHint}>이미지를 클릭하면 크게 볼 수 있어요.</div>
                  </div>
                ) : (
                  <div className={styles.agentArchFlow} aria-label="Architecture flow">
                    {activeArch.flow.map((step, idx) => (
                      <div key={`${step}-${idx}`} className={styles.agentArchFlowItem}>
                        <div className={styles.agentArchNode}>{step}</div>
                        {idx < activeArch.flow.length - 1 && (
                          <div className={styles.agentArchArrow} aria-hidden="true">
                            →
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.agentArchPanel}>
                <div className={styles.agentArchPanelTitle}>Components</div>
                <ul className={styles.agentArchList}>
                  {activeArch.components.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      );
    }

    const data = featureDescriptions[selectedFeature];
    if (data?.description?.length) {
      return (
        <>
          {data.description.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </>
      );
    }

    return (
      <>
        <p>이곳에 상세 설명이 들어갈 예정입니다.</p>
        <p>각 기능에 대한 자세한 내용을 여기에 작성하실 수 있습니다.</p>
        <p>추가 정보나 설명을 원하는 만큼 추가할 수 있습니다.</p>
      </>
    );
  };

  // 한글을 자모 단위로 분리하는 함수
  const decomposeHangul = (char) => {
    const code = char.charCodeAt(0);
    if (code < 0xAC00 || code > 0xD7A3) {
      // 한글이 아니면 그대로 반환
      return [char];
    }
    
    const base = code - 0xAC00;
    const cho = Math.floor(base / (21 * 28));
    const jung = Math.floor((base % (21 * 28)) / 28);
    const jong = base % 28;
    
    const choList = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    const jungList = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
    const jongList = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    
    const result = [choList[cho], jungList[jung]];
    if (jong > 0) {
      result.push(jongList[jong]);
    }
    return result;
  };

  // 텍스트를 글자별 자모 배열로 변환 (각 글자의 자모를 그룹화)
  const textToJamoGroups = (text) => {
    const groups = [];
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === ' ') {
        groups.push({ type: 'space', jamos: [' '], original: ' ' });
      } else {
        const jamos = decomposeHangul(char);
        groups.push({ type: 'hangul', jamos: jamos, original: char });
      }
    }
    return groups;
  };

  // 자모 그룹 배열을 텍스트로 조합 (진행 중인 자모 포함)
  const combineJamoGroups = (groups, jamoCount) => {
    let result = '';
    let currentJamoIndex = 0;
    
    for (const group of groups) {
      if (group.type === 'space') {
        if (currentJamoIndex < jamoCount) {
          result += ' ';
          currentJamoIndex++;
        }
        continue;
      }
      
      // 이 그룹의 자모 개수
      const groupJamoCount = group.jamos.length;
      
      // 이 그룹에 속한 자모가 몇 개나 표시되어야 하는지
      const remainingJamos = jamoCount - currentJamoIndex;
      
      if (remainingJamos <= 0) {
        break;
      }
      
      if (remainingJamos >= groupJamoCount) {
        // 이 그룹의 모든 자모가 표시됨 - 완성된 글자로 조합
        result += group.original;
        currentJamoIndex += groupJamoCount;
      } else {
        // 이 그룹의 일부 자모만 표시됨 - 자모를 조합 시도
        const displayedJamos = group.jamos.slice(0, remainingJamos);
        const combined = tryCombineJamos(displayedJamos);
        result += combined;
        currentJamoIndex += remainingJamos;
        break; // 더 이상 표시할 자모가 없음
      }
    }
    
    return result;
  };

  // 자모 배열을 조합 시도 (가능한 만큼만 조합)
  const tryCombineJamos = (jamoArray) => {
    if (jamoArray.length === 0) return '';
    
    let result = '';
    let i = 0;
    
    while (i < jamoArray.length) {
      const choList = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
      const choIndex = choList.indexOf(jamoArray[i]);
      
      if (choIndex === -1) {
        // 초성이 아니면 그대로 추가 (영문, 숫자 등)
        result += jamoArray[i];
        i++;
        continue;
      }
      
      // 중성 확인
      if (i + 1 >= jamoArray.length) {
        // 중성이 없으면 초성만 표시
        result += jamoArray[i];
        i++;
        break; // 더 이상 조합할 수 없음
      }
      
      const jungList = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
      const jungIndex = jungList.indexOf(jamoArray[i + 1]);
      
      if (jungIndex === -1) {
        // 중성이 아니면 초성만 표시하고 중단
        result += jamoArray[i];
        i++;
        break; // 더 이상 조합할 수 없음
      }
      
      // 종성 확인
      let jongIndex = 0;
      let hasJong = false;
      if (i + 2 < jamoArray.length) {
        const jongList = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
        const tempJongIndex = jongList.indexOf(jamoArray[i + 2]);
        if (tempJongIndex !== -1) {
          jongIndex = tempJongIndex;
          hasJong = true;
        }
      }
      
      if (hasJong) {
        // 초성 + 중성 + 종성 조합
        const charCode = 0xAC00 + (choIndex * 21 * 28) + (jungIndex * 28) + jongIndex;
        result += String.fromCharCode(charCode);
        i += 3;
      } else {
        // 초성 + 중성만 조합
        const charCode = 0xAC00 + (choIndex * 21 * 28) + (jungIndex * 28);
        result += String.fromCharCode(charCode);
        i += 2;
      }
      
      // 한 글자만 조합하고 중단 (다음 글자의 자모와 섞이지 않도록)
      break;
    }
    
    // 조합되지 않은 자모 추가 (진행 중인 자모)
    while (i < jamoArray.length) {
      result += jamoArray[i];
      i++;
    }
    
    return result;
  };

  useEffect(() => {
    // 두 점 사이의 거리 계산 (유클리드 거리)
    const getDistance = (x1, y1, x2, y2) => {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };

    // 기존 텍스트들과 충분한 거리를 두는 위치 찾기
    const findValidPosition = (existingTexts, minDistance = 12) => {
      let attempts = 0;
      const maxAttempts = 50;
      
      while (attempts < maxAttempts) {
        // 슬로건 텍스트와 시작하기 버튼 영역을 피한 위치
        // 중앙 영역(30% ~ 70%)을 피하고 상단 또는 하단에 배치
        let top;
        const randomValue = Math.random();
        if (randomValue < 0.5) {
          // 상단 영역: 5% ~ 25%
          top = Math.random() * 20 + 5;
        } else {
          // 하단 영역: 75% ~ 95%
          top = Math.random() * 20 + 75;
        }
        
        // 좌우 위치도 중앙 영역을 피하도록 조정 (중앙 40% ~ 60% 영역 피하기)
        let left;
        const leftRandom = Math.random();
        if (leftRandom < 0.5) {
          // 좌측 영역: 10% ~ 35%
          left = Math.random() * 25 + 10;
        } else {
          // 우측 영역: 65% ~ 90%
          left = Math.random() * 25 + 65;
        }

        // 기존 텍스트들과의 거리 체크
        const tooClose = existingTexts.some((existing) => {
          const distance = getDistance(left, top, existing.left, existing.top);
          return distance < minDistance;
        });

        if (!tooClose) {
          return { left, top };
        }

        attempts++;
      }

      // 최대 시도 횟수 초과 시 그냥 랜덤 위치 반환
      const randomValue = Math.random();
      let top = randomValue < 0.5 ? Math.random() * 20 + 5 : Math.random() * 20 + 75;
      const leftRandom = Math.random();
      let left = leftRandom < 0.5 ? Math.random() * 25 + 10 : Math.random() * 25 + 65;
      return { left, top };
    };

    const createFloatingText = (existingTexts = []) => {
      const randomText = sloganTexts[Math.floor(Math.random() * sloganTexts.length)];
      const { left, top } = findValidPosition(existingTexts);
      
      // 텍스트를 글자별 자모 그룹으로 변환
      const jamoGroups = textToJamoGroups(randomText);
      // 전체 자모 개수 계산
      const totalJamoCount = jamoGroups.reduce((sum, group) => sum + group.jamos.length, 0);
      
      const now = Date.now();
      const startDelay = Math.random() * 500 + 200; // 200~700ms 지연
      
      return {
        id: Math.random(),
        text: randomText,
        jamoGroups: jamoGroups,
        totalJamoCount: totalJamoCount,
        displayedJamoCount: 0,
        left: left,
        top: top,
        startTime: now + startDelay, // 시작 시간
        lastTypingTime: 0, // 마지막 타이핑 시간
        isTyping: true,
        completedAt: null,
        isFading: false,
        spawnedNext: false,
      };
    };

    // 초기 1개 생성
    setFloatingTexts([createFloatingText([])]);

    // 타자 효과를 위한 인터벌 (자모 단위로 타이핑)
    const typingInterval = setInterval(() => {
      const now = Date.now();
      setFloatingTexts((prev) => {
        return prev.map((item) => {
          // 시작 시간이 지나지 않았으면 타이핑하지 않음
          if (now < item.startTime) {
            return item;
          }
          
          // 타이핑 속도 조절 (각 자모마다 100~150ms 간격)
          const timeSinceLastTyping = now - item.lastTypingTime;
          const typingSpeed = 100; // 평균 100ms마다 한 자모씩
          
          if (item.isTyping && item.displayedJamoCount < item.totalJamoCount) {
            // 마지막 타이핑으로부터 충분한 시간이 지났을 때만 타이핑
            if (timeSinceLastTyping >= typingSpeed) {
              const newCount = item.displayedJamoCount + 1;
              const displayedText = combineJamoGroups(item.jamoGroups, newCount);
              
              return {
                ...item,
                displayedText: displayedText,
                displayedJamoCount: newCount,
                lastTypingTime: now,
                isTyping: newCount < item.totalJamoCount,
                completedAt: newCount === item.totalJamoCount ? now : item.completedAt,
              };
            }
            return item;
          }
          return item;
        });
      });
    }, 50); // 50ms마다 체크 (더 부드러운 애니메이션)

    // 타이핑 완료 0.1초 뒤 다음 텍스트 생성
    const spawnInterval = setInterval(() => {
      const now = Date.now();
      setFloatingTexts((prev) => {
        let spawnCount = 0;
        const updated = prev.map((item) => {
          if (
            item.completedAt &&
            item.displayedJamoCount >= item.totalJamoCount &&
            !item.spawnedNext &&
            now - item.completedAt >= 100
          ) {
            spawnCount += 1;
            return { ...item, spawnedNext: true };
          }
          return item;
        });
        if (spawnCount === 0) {
          return updated;
        }
        // 기존 텍스트들의 위치 정보를 전달하여 겹치지 않는 위치에 생성
        const existingPositions = updated.map((item) => ({ left: item.left, top: item.top }));
        const nextItems = Array.from({ length: spawnCount }, () => createFloatingText(existingPositions));
        return [...updated, ...nextItems];
      });
    }, 50);

    // 타이핑 완료 후 3초 뒤 삭제 (페이드아웃 포함)
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setFloatingTexts((prev) =>
        prev
          .map((item) => {
            if (
              item.completedAt &&
              item.displayedJamoCount >= item.totalJamoCount &&
              !item.isFading &&
              now - item.completedAt >= 2500
            ) {
              return { ...item, isFading: true };
            }
            return item;
          })
          .filter(
            (item) =>
              !item.completedAt ||
              item.displayedJamoCount < item.totalJamoCount ||
              now - item.completedAt < 3000
          )
      );
    }, 100);

    return () => {
      clearInterval(typingInterval);
      clearInterval(spawnInterval);
      clearInterval(cleanupInterval);
    };
  }, []);

  return (
    <AppShell styles={styles} title="" activeNav="company" headerActions={null} showLogo={false}>
      {/* 상단 슬로건 영역 - GPT 스타일 */}
      <div className={styles.sloganSection}>
        {floatingTexts.map((item) => (
          <div
            key={item.id}
            className={`${styles.floatingText} ${item.isFading ? styles.floatingTextFade : ''}`}
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
                <img src="/uploads/ail.png" alt="Ai LLM" />
                <div className={styles.featureCardText}>
                  <h3 className={styles.featureCardTitle}>Ai LLM</h3>
                  <p className={styles.featureCardDescription}>대규모 언어 모델을 활용한 지능형 AI 솔루션</p>
                </div>
              </div>
            </div>
            <div className={styles.featureCard} onClick={() => handleFeatureClick('aiagent')}>
              <div className={styles.featureCardImage}>
                <img src="/uploads/aiagent.png" alt="Ai Agent" />
              </div>
              <div className={styles.featureCardText}>
                <h3 className={styles.featureCardTitle}>Ai Agent</h3>
              </div>
            </div>
            <div className={styles.featureCard} onClick={() => handleFeatureClick('aiocr')}>
              <div className={styles.featureCardImage}>
              <img src="/uploads/aiocr.png" alt="Ai OCR" />
              </div>
              <div className={styles.featureCardText}>
                <h3 className={styles.featureCardTitle}>Ai OCR</h3>

              </div>
            </div>
            <div className={styles.featureCard} onClick={() => handleFeatureClick('finetuning')}>
              <div className={styles.featureCardImage}>
              <img src="/uploads/Fine-tung.png" alt="Fine-tuning" />
              </div>
              <div className={styles.featureCardText}>
                <h3 className={styles.featureCardTitle}>Fine-tuning</h3>
              </div>
            </div>
            <div className={styles.featureCard} onClick={() => handleFeatureClick('rpa')}>
              <div className={styles.featureCardImage}>
              <img src="/uploads/rpa.png" alt="RPA" />
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

          {/* 뉴스/특허/자격 섹션 */}
          <div className={styles.trustSection}>
            <div className={styles.trustHeader}>
              <h2 className={styles.trustTitle}>검증된 성과</h2>
              <p className={styles.trustSubtitle}>
                보도자료, 인증서, 특허로 신뢰를 보여드립니다.
              </p>
            </div>

            <div className={styles.trustGrid}>
              <div className={styles.newsPanel}>
                <div className={styles.panelHeader}>
                  <h3 className={styles.panelTitle}>News</h3>
                  <span className={styles.panelHint}>업데이트/보도자료</span>
                </div>
                <div className={styles.newsList}>
                  {newsItems.map((n) => (
                    <a key={n.title} href={n.href} className={styles.newsCard}>
                      <div className={styles.newsTopRow}>
                        <span className={styles.newsDate}>{n.date}</span>
                        <span className={styles.newsArrow}>›</span>
                      </div>
                      <h4 className={styles.newsTitle}>{n.title}</h4>
                      <p className={styles.newsExcerpt}>{n.excerpt}</p>
                    </a>
                  ))}
                </div>
              </div>

              <div className={styles.credentialPanel}>
                <div className={styles.panelHeader}>
                  <h3 className={styles.panelTitle}>Certificates / Patents</h3>
                  <span className={styles.panelHint}>이미지/캡션</span>
                </div>
                <div className={styles.credentialGrid}>
                  {credentialItems.map((c) => (
                    <div key={c.title + c.subtitle} className={styles.credentialCard}>
                      <div className={styles.credentialThumb}>
                        <img src={c.imageSrc} alt={c.title} />
                      </div>
                      <div className={styles.credentialText}>
                        <div className={styles.credentialTitle}>{c.title}</div>
                        <div className={styles.credentialSubtitle}>{c.subtitle}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Urgency / Trend + Risk removal + Testimonial */}
          <div className={styles.pricingExtra}>
            <section className={styles.pricingExtraSection}>
              <div className={styles.pricingExtraHeader}>
                <p className={styles.pricingExtraEyebrow}>WHY NOW</p>
                <h3 className={styles.pricingExtraTitle}>"Why" 지금 시작해야 하나</h3>
                <div className={styles.pricingExtraCopy}>
                  <p>자동화는 ‘언젠가’가 아니라 ‘지금’ 시작할수록 비용이 줄어듭니다.</p>
                </div>
              </div>

              <div className={styles.urgencyPoints}>
                <div className={styles.urgencyPoint}>
                  <div className={styles.urgencyPointTitle}>업무량 증가</div>
                  <div className={styles.urgencyPointDesc}>처리량이 늘수록 병목은 커집니다. 자동화로 선제 대응하세요.</div>
                </div>
                <div className={styles.urgencyPoint}>
                  <div className={styles.urgencyPointTitle}>인건비 상승</div>
                  <div className={styles.urgencyPointDesc}>반복 업무에 투입되는 시간은 곧 비용입니다. 시간을 회수하세요.</div>
                </div>
                <div className={styles.urgencyPoint}>
                  <div className={styles.urgencyPointTitle}>속도 경쟁</div>
                  <div className={styles.urgencyPointDesc}>고객 대응과 의사결정 속도가 경쟁력입니다. 더 빠르게 움직이세요.</div>
                </div>
              </div>
            </section>

            {/* Risk removal (Barrier 0) */}
            <section className={styles.pricingExtraSection}>
              <div className={styles.pricingExtraHeader}>
                <p className={styles.pricingExtraEyebrow}>RISK REMOVAL</p>
                <h3 className={styles.pricingExtraTitle}>도입 장벽 "Low Risk"</h3>
                <p className={styles.pricingExtraSub}>
                  시작은 가볍게, 운영은 안정적으로. 팀이 부담 없이 도입할 수 있게 설계했습니다.
                </p>
              </div>

              <div className={styles.barrierGrid}>
                <div className={styles.barrierCard}>
                  <div className={styles.barrierTitle}>초기 세팅 지원</div>
                  <div className={styles.barrierDesc}>업무에 맞는 기본 템플릿과 운영 가이드를 함께 제공합니다.</div>
                </div>
                <div className={styles.barrierCard}>
                  <div className={styles.barrierTitle}>기존 시스템 연동</div>
                  <div className={styles.barrierDesc}>API/데이터 연동으로 이미 쓰던 흐름을 유지하며 확장합니다.</div>
                </div>
                <div className={styles.barrierCard}>
                  <div className={styles.barrierTitle}>단계적 확장</div>
                  <div className={styles.barrierDesc}>작게 시작하고, 성과가 보이면 기능과 사용량을 늘리면 됩니다.</div>
                </div>
              </div>
            </section>

            {/* Testimonial */}
            <section className={styles.pricingExtraSection}>
              <div className={styles.pricingExtraHeader}>
                <p className={styles.pricingExtraEyebrow}>TESTIMONIAL</p>
                <h3 className={styles.pricingExtraTitle}>Customer review</h3>
                <p className={styles.pricingExtraSub}>현장에서 느끼는 변화는 ‘숫자’보다 먼저 체감됩니다.</p>
              </div>

              <div className={styles.testimonialGrid}>
                <figure className={styles.testimonialCard}>
                  <blockquote className={styles.testimonialQuote}>
                    “반복 업무가 사라지니, 팀이 ‘중요한 일’에 집중할 수 있게 됐어요.”
                  </blockquote>
                  <figcaption className={styles.testimonialMeta}>운영팀장</figcaption>
                </figure>
                <figure className={styles.testimonialCard}>
                  <blockquote className={styles.testimonialQuote}>
                    “처리 속도는 빨라졌는데 품질은 더 좋아졌습니다. 고객 응대가 달라졌어요.”
                  </blockquote>
                  <figcaption className={styles.testimonialMeta}>CS 매니저</figcaption>
                </figure>
                <figure className={styles.testimonialCard}>
                  <blockquote className={styles.testimonialQuote}>
                    “도입이 어렵지 않았고, 결과가 빨리 보여서 내부 설득이 쉬웠습니다.”
                  </blockquote>
                  <figcaption className={styles.testimonialMeta}>기획팀</figcaption>
                </figure>
              </div>
            </section>
          </div>

          {/* 요금제 카드 3개 */}
          <div className={styles.pricingSection}>
            <div className={styles.pricingHeader}>
              <h2 className={styles.pricingTitle}>요금제</h2>
              <p className={styles.pricingSubtitle}>
                필요한 만큼 선택하고, 확장하면서 비용을 최적화하세요.
              </p>
            </div>
            <div className={styles.pricingGrid}>
              {pricingPlans.map((plan) => (
                <div
                  key={plan.key}
                  className={`${styles.pricingCard} ${styles[`pricingCardTone_${plan.tone}`]} ${
                    plan.highlight ? styles.pricingCardHighlight : ''
                  }`}
                >
                  {plan.highlight && <div className={styles.pricingBadge}>추천</div>}
                  <div className={styles.pricingCardTop}>
                    <h3 className={styles.pricingCardName}>{plan.name}</h3>
                    <p className={styles.pricingCardDesc}>{plan.description}</p>
                  </div>
                  <div className={styles.pricingPriceRow}>
                    <span className={styles.pricingPrice}>{plan.price}</span>
                    {plan.period && <span className={styles.pricingPeriod}>{plan.period}</span>}
                  </div>
                  <ul className={styles.pricingList}>
                    {plan.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <div className={styles.pricingActions}>
                    {plan.key === 'enterprise' ? (
                      <button className={styles.pricingButtonSecondary} type="button">
                        상담 요청
                      </button>
                    ) : (
                      <button className={styles.pricingButtonPrimary} type="button">
                        시작하기
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Branding + ROI (below pricing cards) */}
            <div className={styles.pricingAfter}>
              <div className={styles.pricingAfterGrid}>
                <div className={styles.pricingAfterCard}>
                  <p className={styles.pricingAfterEyebrow}>BRAND PROMISE</p>
                  <h3 className={styles.pricingAfterTitle}>일이 매끄럽게 흐르는 경험</h3>
                  <p className={styles.pricingAfterDesc}>
                    반복은 자동화로, 판단은 사람에게. 팀이 핵심 업무에 집중하도록 설계합니다.
                  </p>
                  <div className={styles.promisePills}>
                    <span className={styles.promisePill}>빠르게</span>
                    <span className={styles.promisePill}>정확하게</span>
                    <span className={styles.promisePill}>안전하게</span>
                  </div>
                </div>

                <div className={`${styles.pricingAfterCard} ${styles.pricingAfterCardRoi}`}>
                  <p className={styles.pricingAfterEyebrow}>ROI SNAPSHOT</p>
                  <h3 className={styles.pricingAfterTitle}>한 번의 도입, 매달 반복되는 절감</h3>
                  <div className={styles.roiStats}>
                    <div className={styles.roiStat}>
                      <div className={styles.roiStatValue}>166h</div>
                      <div className={styles.roiStatLabel}>월 절감 시간(예시)</div>
                    </div>
                    <div className={styles.roiStat}>
                      <div className={styles.roiStatValue}>2m</div>
                      <div className={styles.roiStatLabel}>건당 절감(예시)</div>
                    </div>
                    <div className={styles.roiStat}>
                      <div className={styles.roiStatValue}>5,000</div>
                      <div className={styles.roiStatLabel}>월 처리량(예시)</div>
                    </div>
                  </div>
                  <div className={styles.roiExample}>
                    예: 월 5,000건 × 건당 2분 절감 = <strong>166시간/월</strong>
                  </div>
                  <div className={styles.roiNote}>* 예시는 업무/프로세스/처리량에 따라 달라질 수 있습니다.</div>

                  <div className={styles.pricingCtaRow}>
                    <Link href="/inquiry" className={styles.pricingButtonPrimary}>
                      상담 요청
                    </Link>
                  </div>
                </div>
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
                  aria-label="닫기"
                >
                  ×
                </button>
                <div className={styles.modalContent}>
                  <div className={styles.modalHeader}>
                    <div className={styles.modalHeaderText}>
                      <p className={styles.modalEyebrow}>CUSTOM AI</p>
                      <h2 className={styles.modalTitle}>
                        {selectedFeature === 'aillm' && 'Ai LLM'}
                        {selectedFeature === 'aiagent' && 'Ai Agent'}
                        {selectedFeature === 'aiocr' && 'Ai OCR'}
                        {selectedFeature === 'finetuning' && 'Fine-tuning'}
                        {selectedFeature === 'rpa' && 'RPA'}
                        {selectedFeature === 'modelcustom' && 'Model Custom'}
                      </h2>
                    </div>
                    <div className={styles.modalHeaderActions}>
                      {selectedFeature === 'aillm' && (
                        <Link href="/aillm" className={styles.modalPrimaryButton}>
                          시작하기 <span className={styles.chevron}>›</span>
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className={styles.modalBody}>
                    {renderModalBody()}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

    </AppShell>
  );
}
