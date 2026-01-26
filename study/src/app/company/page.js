'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { AppShell } from '../components/AppShell';
import { LoginModal } from '../components/LoginModal';
import { isAdmin, getUser, getToken } from '@/utils/auth';

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
    price: '19,000',
    period: '/월',
    description: '개인/소규모 팀을 위한 시작 플랜',
    features: ['기본 임배딩', '멀티모달 질문', '기본 LLM 기능 제공 (MCP, 화면커스텀)'],
  },
  {
    key: 'pro',
    name: 'Pro',
    price: '49,900',
    period: '/월',
    description: '업무 자동화를 본격적으로 확장',
    features: ['심화 임베딩(OCR 사용)', '멀티모달 질문', '기본 LLM 기능 제공 (MCP, 화면커스텀)', 'RPA 연동기능이 없는 Agent'],
    highlight: true,
  },
  {
    key: 'premium',
    name: 'Premium',
    price: '149,000',
    period: '/월',
    description: '고급 기능과 확장된 지원',
    features: ['심화 임베딩(OCR 사용)', '멀티모달 질문', '기본 LLM 기능 제공 (MCP, 화면커스텀)', '음성인식 (STT, TTS)', 'OCR (문서 파서기능)'],
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    price: '문의',
    period: '',
    description: '보안/연동/커스텀 요구사항 대응',
    features: ['RPA', '자체모델 제작', '모델 파인튜닝', '폐쇄망 구축', 'RPA 연동기능이 있는 Agent'],
  },
];


const customerReviews = [
  { quote: '“반복 업무가 사라지니, 팀이 ‘중요한 일’에 집중할 수 있게 됐어요.”', meta: '운영팀장' },
  { quote: '“처리 속도는 빨라졌는데 품질은 더 좋아졌습니다. 고객 응대가 달라졌어요.”', meta: 'CS 매니저' },
  { quote: '“도입이 어렵지 않았고, 결과가 빨리 보여서 내부 설득이 쉬웠습니다.”', meta: '기획팀' },
  { quote: '“문서 흐름이 표준화되면서 누락이 줄었고, 새로 온 인력도 바로 따라오더라고요.”', meta: '백오피스 리드' },
  { quote: '“조회→정리→보고까지 걸리던 시간이 짧아지니 의사결정이 빨라졌습니다.”', meta: '관리/경영지원' },
  { quote: '“예외 케이스만 사람이 처리하고 대부분은 자동으로 끝나니, 야근이 눈에 띄게 줄었어요.”', meta: '운영 담당자' },
  { quote: '“업무별로 맞는 템플릿이 있으니, 결과물이 매번 일정해서 협업이 편해졌습니다.”', meta: 'PM' },
  { quote: '“데이터 근거가 같이 남으니까 감사 대응이 훨씬 쉬워졌습니다.”', meta: '컴플라이언스' },
  { quote: '“상담부터 구축까지 커뮤니케이션이 명확해서 현업 스트레스가 줄었습니다.”', meta: '현업 오너' },
  { quote: '“요청이 들어오면 처리 흐름이 자동으로 정리돼서, 팀 간 핑퐁이 확 줄었어요.”', meta: '운영' },
  { quote: '“정책/권한이 적용된 상태로만 답변이 나오니 내부 공유가 훨씬 안전해졌습니다.”', meta: '보안/IT' },
  { quote: '“업무가 몰리는 피크 타임에도 응대 품질이 유지돼 만족도가 올라갔습니다.”', meta: '고객지원' },
  { quote: '“정산/마감이 자동화되니 오류가 줄고, 마감 시간도 앞당겨졌습니다.”', meta: '재무' },
  { quote: '“업무 기준이 ‘사람’에서 ‘프로세스’로 바뀌면서 운영이 안정화됐습니다.”', meta: '운영리더' },
  { quote: '“기록과 로그가 남아서 문제 발생 시 원인 추적이 빨라졌습니다.”', meta: '개발/운영' },
  { quote: '“새로운 업무도 템플릿으로 빠르게 적용돼 확장 속도가 빨라요.”', meta: 'PMO' },
  { quote: '“현업이 원하는 형태로 결과물이 나와서, 재작업이 거의 없어졌습니다.”', meta: '기획' },
  { quote: '“작게 시작해서 성과 보고 확장하는 방식이라, 내부 합의가 쉬웠습니다.”', meta: '프로덕트' },
];

const aiLlmDefinitionSteps = ['질문/요청 입력', '문맥 검색(RAG)', '추론/생성', '검증/정제', '답변/산출물 제공'];
const aiLlmDemoVideoSrc = '/uploads/aillm-demo.mp4';

const aiLlmUseCases = [
  {
    title: '사내 문서 RAG',
    desc: '규정/가이드/업무 문서를 근거로 답변을 제공합니다.',
    videoSrc: '/uploads/aillm-case-01.mp4',
    arch: {
      diagramSrc: '',
      flow: ['질문', '권한 필터', 'RAG 검색(Vector DB)', 'LLM 생성', '근거 포함 답변'],
      components: ['LLM', 'Vector DB', '문서 커넥터(Drive/Notion/Wiki)', '권한/정책', '로그/피드백'],
    },
  },
  {
    title: '문서보안 임베딩',
    desc: '해당 문서또는 페이지에 권한에따라 접근 가능하게 합니다.',
    videoSrc: '/uploads/aillm-case-02.mp4',
    arch: {
      diagramSrc: '',
      flow: ['문서 업로드', '파싱', '요약/추출', '템플릿 적용', '다운로드/공유'],
      components: ['LLM', '문서 파서', '템플릿', '스토리지', '공유(메일/드라이브)'],
    },
  },
  {
    title: 'PDF Parser',
    desc: 'Ai OCR 기술을 활용하여 PDF 문서를 파싱하고 추출합니다.',
    videoSrc: '/uploads/aillm-case-03.mp4',
    arch: {
      diagramSrc: '',
      flow: ['요청', '컨텍스트 입력', '초안 생성', '검토/수정', '발송/저장'],
      components: ['LLM', '프롬프트/템플릿', 'HITL(옵션)', '메일/문서 시스템', '로그'],
    },
  },
  {
    title: '음성인식 시스템',
    desc: '문의 내용을 분류하고 답변 초안을 제안합니다.',
    videoSrc: '/uploads/aillm-case-04.mp4',
    arch: {
      diagramSrc: '',
      flow: ['문의', '분류', '지식 검색', '답변 생성', '검토/전송'],
      components: ['LLM', '분류기(옵션)', '지식베이스/RAG', 'HITL', 'CRM/헬프데스크'],
    },
  },
];

const aiOcrDefinitionSteps = ['문서 입력', '전처리', '레이아웃 분석', 'OCR 인식', '필드 추출', '검증/후처리', '내보내기/API'];
const aiOcrDemoVideoSrc = '/uploads/aiocr-demo.mp4';
const aiOcrUseCases = [
  {
    title: '세금계산서/청구서 추출',
    desc: '공급자/공급받는자/금액/품목 등 주요 필드를 자동 추출합니다.',
    videoSrc: '/uploads/aiocr-case-01.mp4',
    arch: {
      diagramSrc: '',
      flow: ['이미지/PDF', '전처리', '레이아웃 분석', 'OCR', '필드 추출', '검증', 'ERP/DB 저장'],
      components: ['OCR 엔진', '레이아웃 모델', '필드 추출기', '룰/검증', '스토리지', 'API'],
    },
  },
  {
    title: '계약서/문서 분류',
    desc: '문서 유형 자동 분류 후 필요한 항목만 골라 추출합니다.',
    videoSrc: '/uploads/aiocr-case-02.mp4',
    arch: {
      diagramSrc: '',
      flow: ['문서 업로드', '분류', 'OCR', '키워드/필드 추출', '요약/인덱싱', '내보내기'],
      components: ['문서 분류기', 'OCR', '추출 파이프라인', '검색 인덱스', '권한/정책'],
    },
  },
  {
    title: '영수증/정산 자동화',
    desc: '영수증 금액/날짜/가맹점/부가세 등 정산 데이터를 추출합니다.',
    videoSrc: '/uploads/aiocr-case-03.mp4',
    arch: {
      diagramSrc: '',
      flow: ['촬영/업로드', '전처리', 'OCR', '라인아이템 추출', '검증', '정산 시스템 연동'],
      components: ['OCR', '라인아이템 추출', '검증 규칙', '정산/회계 API', '로그'],
    },
  },
  {
    title: '신분증/증빙 서류 검증',
    desc: '증빙 서류의 주요 필드 추출 및 기본 검증을 수행합니다.',
    videoSrc: '/uploads/aiocr-case-04.mp4',
    arch: {
      diagramSrc: '',
      flow: ['이미지 입력', '전처리', 'OCR', '필드 추출', '규칙 검증', '저장/알림'],
      components: ['OCR', '필드 추출기', '검증 룰', '저장소', '알림'],
    },
  },
];

const fineTuningDefinitionSteps = ['요구사항 정의', '데이터 수집', '정제/라벨링', '파인튜닝 학습', '평가', '배포', '모니터링/개선'];
const fineTuningDemoVideoSrc = '/uploads/finetuning-demo.mp4';
const fineTuningUseCases = [
  {
    title: '도메인 맞춤 Q&A',
    desc: '사내/업종 용어와 문맥에 맞게 답변 품질을 높입니다.',
    videoSrc: '/uploads/finetuning-case-01.mp4',
    arch: {
      diagramSrc: '',
      flow: ['데이터 수집', '정제/라벨링', '학습', '평가', '배포', 'A/B 테스트'],
      components: ['학습 데이터', '튜닝 파이프라인', '평가 셋', '모델 레지스트리', '서빙'],
    },
  },
  {
    title: '업무 문서 작성 스타일 고정',
    desc: '보고서/메일/문서 톤과 포맷을 조직 표준에 맞춥니다.',
    videoSrc: '/uploads/finetuning-case-02.mp4',
    arch: {
      diagramSrc: '',
      flow: ['샘플 수집', '가이드라인 정리', '튜닝', '검수', '배포'],
      components: ['템플릿/가이드', '튜닝 데이터', '검수(HITL)', '서빙 API', '로그'],
    },
  },
  {
    title: '분류/추출 성능 강화',
    desc: '문의 분류, 태깅, 정보 추출 정확도를 개선합니다.',
    videoSrc: '/uploads/finetuning-case-03.mp4',
    arch: {
      diagramSrc: '',
      flow: ['라벨 데이터', '훈련', '평가', '배포', '피드백 루프'],
      components: ['라벨링 툴', '학습 파이프라인', '모니터링', '피드백 수집'],
    },
  },
];

const rpaDefinitionSteps = ['업무 선정', '프로세스 설계', '자동화 개발', '테스트', '배포', '운영/모니터링', '개선'];
const rpaDemoVideoSrc = '/uploads/rpa-demo.mp4';
const rpaUseCases = [
  {
    title: '반복 입력/전표 처리',
    desc: 'ERP/그룹웨어의 반복 입력을 자동화합니다.',
    videoSrc: '/uploads/rpa-case-01.mp4',
    arch: {
      diagramSrc: '',
      flow: ['트리거', '업무 규칙', 'RPA 실행', '결과 기록', '알림'],
      components: ['RPA 봇', '업무 규칙', '대상 시스템(ERP/웹)', '로그', '알림'],
    },
  },
  {
    title: '메일/첨부 처리 자동화',
    desc: '메일 수신→첨부 저장→분류/등록까지 자동 처리합니다.',
    videoSrc: '/uploads/rpa-case-02.mp4',
    arch: {
      diagramSrc: '',
      flow: ['메일 수신', '첨부 추출', '저장', '등록', '완료 알림'],
      components: ['메일 서버', 'RPA', '스토리지', '업무 시스템', '로그'],
    },
  },
  {
    title: '정산/마감 자동화',
    desc: '정산 데이터 수집과 마감 리포트 생성/업로드를 자동화합니다.',
    videoSrc: '/uploads/rpa-case-03.mp4',
    arch: {
      diagramSrc: '',
      flow: ['스케줄', '수집', '정합성 체크', '업로드', '리포트'],
      components: ['스케줄러', 'RPA', 'DB/CSV', '리포트', '모니터링'],
    },
  },
];

const modelCustomDefinitionSteps = ['요구사항 정의', '데이터 분석', '모델 설계', '학습/튜닝', '평가', '배포', '운영/개선'];
const modelCustomDemoVideoSrc = '/uploads/modelcustom-demo.mp4';
const modelCustomUseCases = [
  {
    title: '전용 모델 설계/구축',
    desc: '업무 요구에 맞는 전용 모델을 설계하고 구축합니다.',
    videoSrc: '/uploads/modelcustom-case-01.mp4',
    arch: {
      diagramSrc: '',
      flow: ['요구 정의', '데이터 준비', '모델 설계', '학습', '평가', '배포'],
      components: ['데이터 파이프라인', '학습 환경', '모델 레지스트리', '서빙', '모니터링'],
    },
  },
  {
    title: '멀티모달(문서+이미지) 처리',
    desc: '문서/이미지 기반 업무에 최적화된 모델을 구축합니다.',
    videoSrc: '/uploads/modelcustom-case-02.mp4',
    arch: {
      diagramSrc: '',
      flow: ['입력', '전처리', '모델 추론', '후처리', '결과 제공'],
      components: ['전처리', '모델 서빙', '후처리', 'API', '로그'],
    },
  },
  {
    title: '내부 데이터 기반 추천/분석',
    desc: '내부 데이터를 활용한 추천/예측 모델을 개발합니다.',
    videoSrc: '/uploads/modelcustom-case-03.mp4',
    arch: {
      diagramSrc: '',
      flow: ['데이터 수집', '특징 생성', '학습', '배포', '피드백'],
      components: ['Feature Store', '학습 파이프라인', '서빙', '모니터링'],
    },
  },
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
  const router = useRouter();
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [activeAiLlmUseCaseIndex, setActiveAiLlmUseCaseIndex] = useState(0);
  const [activeAiOcrUseCaseIndex, setActiveAiOcrUseCaseIndex] = useState(0);
  const [activeFineTuningUseCaseIndex, setActiveFineTuningUseCaseIndex] = useState(0);
  const [activeRpaUseCaseIndex, setActiveRpaUseCaseIndex] = useState(0);
  const [activeModelCustomUseCaseIndex, setActiveModelCustomUseCaseIndex] = useState(0);
  const [activeAiAgentUseCaseIndex, setActiveAiAgentUseCaseIndex] = useState(0);
  
  // 관리자 편집 모드 관련 상태
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // 클라이언트 마운트 확인용
  const [pageContent, setPageContent] = useState(null);
  const [originalPageContent, setOriginalPageContent] = useState(null); // 편집 시작 시 원본 데이터 저장
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false); // 저장되지 않은 변경사항 추적
  const [achievements, setAchievements] = useState([]);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [newAchievement, setNewAchievement] = useState({ title: '', date: '', excerpt: '', href: '#', type: 'news' });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingWhyNow, setEditingWhyNow] = useState(false);
  const [editingRiskRemoval, setEditingRiskRemoval] = useState(false);
  const [editingPricing, setEditingPricing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature);
    if (feature === 'aillm') {
      setActiveAiLlmUseCaseIndex(0);
    }
    if (feature === 'aiocr') {
      setActiveAiOcrUseCaseIndex(0);
    }
    if (feature === 'finetuning') {
      setActiveFineTuningUseCaseIndex(0);
    }
    if (feature === 'rpa') {
      setActiveRpaUseCaseIndex(0);
    }
    if (feature === 'modelcustom') {
      setActiveModelCustomUseCaseIndex(0);
    }
    if (feature === 'aiagent') {
      setActiveAiAgentUseCaseIndex(0);
    }
  };

  const testimonialRows = 3;
  const getTestimonialRowItems = (rowIndex) => customerReviews.filter((_, idx) => idx % testimonialRows === rowIndex);

  const renderModalBody = () => {
    if (!selectedFeature) return null;

    const renderStructuredModal = ({
      definitionSteps,
      useCases,
      activeIndex,
      setActiveIndex,
      demoVideoSrc,
      useCaseHeading,
      ariaLabel,
    }) => {
      const activeUseCase = useCases[activeIndex] || useCases[0];
      const activeVideoSrc = activeUseCase?.videoSrc || demoVideoSrc;
      const activeArch = activeUseCase?.arch || {
        diagramSrc: '',
        flow: ['입력', '처리', '출력'],
        components: [],
      };

      return (
        <>
          <h3>정의 및 구성요소</h3>
          <div className={styles.agentStepper} aria-label={ariaLabel}>
            {definitionSteps.map((step) => (
              <div key={step} className={styles.agentStep}>
                {step}
              </div>
            ))}
          </div>

          <h3>{useCaseHeading}</h3>
          <div className={styles.useCaseGrid}>
            {useCases.map((c, idx) => (
              <button
                key={c.title}
                type="button"
                className={`${styles.useCaseCard} ${idx === activeIndex ? styles.useCaseCardActive : ''}`}
                onClick={() => setActiveIndex(idx)}
                aria-pressed={idx === activeIndex}
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
            <video key={activeVideoSrc} className={styles.modalVideo} controls playsInline preload="metadata">
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
                        alt={`${activeUseCase?.title || 'Feature'} 플로우 다이어그램`}
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
    };

    if (selectedFeature === 'aillm') {
      return renderStructuredModal({
        definitionSteps: aiLlmDefinitionSteps,
        useCases: aiLlmUseCases,
        activeIndex: activeAiLlmUseCaseIndex,
        setActiveIndex: setActiveAiLlmUseCaseIndex,
        demoVideoSrc: aiLlmDemoVideoSrc,
        useCaseHeading: 'AI LLM 사용 예시',
        ariaLabel: 'AI LLM steps',
      });
    }

    if (selectedFeature === 'aiocr') {
      return renderStructuredModal({
        definitionSteps: aiOcrDefinitionSteps,
        useCases: aiOcrUseCases,
        activeIndex: activeAiOcrUseCaseIndex,
        setActiveIndex: setActiveAiOcrUseCaseIndex,
        demoVideoSrc: aiOcrDemoVideoSrc,
        useCaseHeading: 'AI OCR 사용 예시',
        ariaLabel: 'AI OCR steps',
      });
    }

    if (selectedFeature === 'finetuning') {
      return renderStructuredModal({
        definitionSteps: fineTuningDefinitionSteps,
        useCases: fineTuningUseCases,
        activeIndex: activeFineTuningUseCaseIndex,
        setActiveIndex: setActiveFineTuningUseCaseIndex,
        demoVideoSrc: fineTuningDemoVideoSrc,
        useCaseHeading: 'Fine-tuning 사용 예시',
        ariaLabel: 'Fine-tuning steps',
      });
    }

    if (selectedFeature === 'rpa') {
      return renderStructuredModal({
        definitionSteps: rpaDefinitionSteps,
        useCases: rpaUseCases,
        activeIndex: activeRpaUseCaseIndex,
        setActiveIndex: setActiveRpaUseCaseIndex,
        demoVideoSrc: rpaDemoVideoSrc,
        useCaseHeading: 'RPA 사용 예시',
        ariaLabel: 'RPA steps',
      });
    }

    if (selectedFeature === 'modelcustom') {
      return renderStructuredModal({
        definitionSteps: modelCustomDefinitionSteps,
        useCases: modelCustomUseCases,
        activeIndex: activeModelCustomUseCaseIndex,
        setActiveIndex: setActiveModelCustomUseCaseIndex,
        demoVideoSrc: modelCustomDemoVideoSrc,
        useCaseHeading: 'Model Custom 사용 예시',
        ariaLabel: 'Model Custom steps',
      });
    }

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

  // 클라이언트 마운트 확인
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 관리자 권한 확인 및 데이터 로드
  useEffect(() => {
    if (!isMounted) return; // 클라이언트에서만 실행
    
    const checkAdmin = () => {
      const adminStatus = isAdmin();
      console.log('Admin check:', adminStatus);
      console.log('User data:', getUser());
      setIsAdminUser(adminStatus);
    };
    
    // 초기 확인
    checkAdmin();

    // 로그인 상태 변경 감지
    const handleLoginChange = () => {
      checkAdmin();
    };
    window.addEventListener('loginStatusChange', handleLoginChange);
    window.addEventListener('storage', handleLoginChange);

    // 콘텐츠 로드
    const loadContent = async () => {
      try {
        const response = await fetch('/api/company/content');
        if (response.ok) {
          const data = await response.json();
          setPageContent(data);
          setHasUnsavedChanges(false); // 로드 시 변경사항 없음
        }
      } catch (error) {
        console.error('Failed to load content:', error);
      }
    };

    // 게시글 로드 및 초기 데이터 설정
    const loadAchievements = async () => {
      try {
        const response = await fetch('/api/company/achievements');
        if (response.ok) {
          const data = await response.json();
          // _id를 문자열로 변환하여 일관성 유지
          const processedData = data.map(item => ({
            ...item,
            _id: item._id?.toString() || item._id
          }));
          
          // news 타입 데이터가 없으면 초기 데이터를 데이터베이스에 저장
          const newsItems = processedData.filter(a => a.type === 'news');
          if (newsItems.length === 0) {
            // 초기 news 데이터를 데이터베이스에 저장
            const initialNewsData = [
              {
                title: 'Custom AI, 업무 자동화 솔루션 고도화',
                date: '2026-01-01',
                excerpt: 'LLM 기반 문서 처리와 워크플로우 자동화를 결합해 운영 효율을 개선했습니다.',
                href: '#',
                type: 'news',
              },
              {
                title: 'AI OCR 적용으로 입력 업무 70% 절감',
                date: '2025-12-12',
                excerpt: '문서 인식 정확도를 높이고 예외 케이스 처리 시간을 단축했습니다.',
                href: '#',
                type: 'news',
              },
              {
                title: 'RPA + Agent 도입 사례 공개',
                date: '2025-11-20',
                excerpt: '반복 업무를 자동화하고 승인/보고 흐름을 표준화했습니다.',
                href: '#',
                type: 'news',
              },
            ];
            
            // 초기 데이터는 관리자 권한 없이 저장 (시스템 초기화용)
            // 실제로는 관리자만 초기 데이터를 설정할 수 있어야 하지만,
            // 현재는 데이터가 없을 때만 자동으로 설정되므로 허용
            for (const item of initialNewsData) {
              try {
                await fetch('/api/company/achievements', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(item),
                });
              } catch (error) {
                console.error('Failed to save initial news item:', error);
              }
            }
          }
          
          // credential 타입 데이터가 없으면 초기 데이터를 데이터베이스에 저장
          const credentialItems = processedData.filter(a => a.type === 'credential');
          if (credentialItems.length === 0) {
            // 초기 credential 데이터를 데이터베이스에 저장
            const initialCredentialData = [
              { title: '특허 등록', subtitle: '문서 자동 분류 방법', imageSrc: '/uploads/aillm.png' },
              { title: '특허 출원', subtitle: '워크플로우 추천 엔진', imageSrc: '/uploads/aillm.png' },
              { title: '자격증', subtitle: '정보보안/클라우드', imageSrc: '/uploads/aillm.png' },
              { title: '인증', subtitle: '품질/ISMS 준비', imageSrc: '/uploads/aillm.png' },
            ];
            
            // 초기 데이터는 관리자 권한 없이 저장 (시스템 초기화용)
            for (const item of initialCredentialData) {
              try {
                await fetch('/api/company/achievements', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    title: item.title,
                    date: new Date().toISOString().split('T')[0],
                    excerpt: item.subtitle,
                    href: item.imageSrc, // imageSrc를 href에 저장
                    type: 'credential',
                  }),
                });
              } catch (error) {
                console.error('Failed to save initial credential item:', error);
              }
            }
          }
          
          // 초기 데이터 저장 후 다시 로드
          if (newsItems.length === 0 || credentialItems.length === 0) {
            const reloadResponse = await fetch('/api/company/achievements');
            if (reloadResponse.ok) {
              const reloadData = await reloadResponse.json();
              const reloadProcessedData = reloadData.map(item => ({
                ...item,
                _id: item._id?.toString() || item._id
              }));
              setAchievements(reloadProcessedData);
              return;
            }
          }
          
          setAchievements(processedData);
        }
      } catch (error) {
        console.error('Failed to load achievements:', error);
      }
    };

    loadContent();
    loadAchievements();

    return () => {
      window.removeEventListener('loginStatusChange', handleLoginChange);
      window.removeEventListener('storage', handleLoginChange);
    };
  }, [isMounted]);

  // 콘텐츠 저장 함수
  const saveContent = async (contentData) => {
    try {
      const token = getToken();
      if (!token) {
        alert('로그인이 필요합니다.');
        return false;
      }

      const response = await fetch('/api/company/content', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ data: contentData }),
      });
      if (response.ok) {
        alert('저장되었습니다.');
        setPageContent(contentData);
        setHasUnsavedChanges(false);
        return true;
      } else {
        const errorData = await response.json().catch(() => ({ error: '저장에 실패했습니다.' }));
        if (response.status === 403) {
          alert('관리자 권한이 필요합니다.');
        } else {
          alert(errorData.error || '저장에 실패했습니다.');
        }
        return false;
      }
    } catch (error) {
      console.error('Failed to save content:', error);
      alert('저장 중 오류가 발생했습니다.');
      return false;
    }
  };

  // 저장하고 편집 종료
  const handleSaveAndExit = async () => {
    if (pageContent) {
      const success = await saveContent(pageContent);
      if (success) {
        setIsEditMode(false);
        setOriginalPageContent(null); // 저장 후 원본 데이터 초기화
      }
    } else {
      setIsEditMode(false);
      setOriginalPageContent(null);
    }
  };

  // 편집 종료 처리
  const handleExitEdit = () => {
    if (hasUnsavedChanges) {
      if (confirm('저장하지 않은 변경사항이 있습니다. 저장하시겠습니까?')) {
        handleSaveAndExit();
      } else {
        // 취소를 누르면 원본 데이터로 되돌림
        if (originalPageContent) {
          setPageContent(JSON.parse(JSON.stringify(originalPageContent)));
        }
        setIsEditMode(false);
        setHasUnsavedChanges(false);
        setOriginalPageContent(null);
      }
    } else {
      setIsEditMode(false);
      setOriginalPageContent(null);
    }
  };

  // 이미지 업로드 함수
  const handleImageUpload = async (file) => {
    if (!file) return null;

    setUploadingImage(true);
    try {
      // 파일을 base64로 변환
      const reader = new FileReader();
      const base64 = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // 업로드 API 호출
      const token = getToken();
      if (!token) {
        alert('로그인이 필요합니다.');
        return null;
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          file: base64,
          fileName: file.name,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setImagePreview(data.url);
        setNewAchievement({ ...newAchievement, href: data.url });
        return data.url;
      } else {
        const errorData = await response.json().catch(() => ({ error: '이미지 업로드에 실패했습니다.' }));
        if (response.status === 403) {
          alert('관리자 권한이 필요합니다.');
        } else {
          alert(errorData.error || '이미지 업로드에 실패했습니다.');
        }
        return null;
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // 게시글 추가 함수
  const handleAddAchievement = async () => {
    if (!newAchievement.title) {
      alert('제목을 입력해주세요.');
      return;
    }

    // 날짜가 없으면 현재 날짜로 설정
    const achievementToAdd = {
      ...newAchievement,
      date: newAchievement.date || new Date().toISOString().split('T')[0]
    };

    try {
      const token = getToken();
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const response = await fetch('/api/company/achievements', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(achievementToAdd),
      });

      if (response.ok) {
        const data = await response.json();
        setNewAchievement({ title: '', date: '', excerpt: '', href: '#', type: 'news' });
        setImagePreview(null);
        setShowAchievementModal(false);
        alert('게시글이 추가되었습니다.');
        // achievements 다시 로드하여 최신 상태 유지 (기존 항목 유지)
        const reloadResponse = await fetch('/api/company/achievements');
        if (reloadResponse.ok) {
          const reloadData = await reloadResponse.json();
          // _id를 문자열로 변환하여 일관성 유지
          const processedData = reloadData.map(item => ({
            ...item,
            _id: item._id?.toString() || item._id
          }));
          setAchievements(processedData);
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: '게시글 추가에 실패했습니다.' }));
        if (response.status === 403) {
          alert('관리자 권한이 필요합니다.');
        } else {
          alert(errorData.error || '게시글 추가에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('Failed to add achievement:', error);
      alert('게시글 추가 중 오류가 발생했습니다.');
    }
  };

  // 게시글 삭제 함수
  const handleDeleteAchievement = async (id) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const token = getToken();
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const response = await fetch(`/api/company/achievements?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setAchievements(achievements.filter(a => a._id !== id));
        alert('게시글이 삭제되었습니다.');
      } else {
        const errorData = await response.json().catch(() => ({ error: '게시글 삭제에 실패했습니다.' }));
        if (response.status === 403) {
          alert('관리자 권한이 필요합니다.');
        } else {
          alert(errorData.error || '게시글 삭제에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('Failed to delete achievement:', error);
      alert('게시글 삭제 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    if (!isMounted) return; // 클라이언트에서만 실행
    
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
  }, [isMounted]);

  return (
    <>
    <AppShell styles={styles} title="" activeNav="company" headerActions={null} showLogo={false} onLoginClick={() => setShowLoginModal(true)}>
      {/* 상단 슬로건 영역 - GPT 스타일 */}
      <div className={styles.sloganSection}>
        {/* 수정하기/저장/편집 종료 버튼 - 슬로건 섹션 오른쪽 상단 */}
        {isMounted && isAdminUser && (
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            display: 'flex',
            gap: '0.5rem',
            zIndex: 100
          }}>
            {isEditMode ? (
              <>
                <button
                  onClick={handleSaveAndExit}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    transition: 'all 0.2s',
                    minWidth: '100px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                  }}
                >
                  저장
                </button>
                <button
                  onClick={handleExitEdit}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    transition: 'all 0.2s',
                    minWidth: '100px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                  }}
                >
                  편집 종료
                </button>
              </>
            ) : (
              <button
                  onClick={() => {
                    // 편집 모드 시작 시 원본 데이터 저장
                    if (pageContent) {
                      setOriginalPageContent(JSON.parse(JSON.stringify(pageContent)));
                    }
                    setIsEditMode(true);
                    setHasUnsavedChanges(false); // 편집 모드 시작 시 변경사항 없음
                    setEditingWhyNow(false);
                    setEditingRiskRemoval(false);
                    setEditingPricing(false);
                  }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  transition: 'all 0.2s',
                  minWidth: '100px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                }}
              >
                수정하기
              </button>
            )}
          </div>
        )}
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
          {isMounted && isEditMode && isAdminUser ? (
            <>
              <textarea
                value={pageContent?.sloganMain || 'AI 기반 자동화 솔루션으로\n생산성을 높이고 업무의 새로운 경험을 제공합니다'}
                onChange={(e) => {
                  const newContent = { ...pageContent, sloganMain: e.target.value };
                  setPageContent(newContent);
                  setHasUnsavedChanges(true);
                }}
                className={styles.editInput}
                style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: 'bold', 
                  marginBottom: '1rem',
                  width: '100%',
                  minHeight: '120px',
                  padding: '1rem',
                  marginTop: isAdminUser ? '3rem' : '0'
                }}
              />
              <textarea
                value={pageContent?.sloganSubtext || '가장 똑똑하고 빠르고 실용적인 AI 모델이 탑재되어 더욱 깊이 있게 사고합니다. 이제 누구나 사용할 수 있습니다.'}
                onChange={(e) => {
                  const newContent = { ...pageContent, sloganSubtext: e.target.value };
                  setPageContent(newContent);
                  setHasUnsavedChanges(true);
                }}
                className={styles.editInput}
                style={{ 
                  fontSize: '1.125rem', 
                  marginBottom: '1rem',
                  width: '100%',
                  minHeight: '60px',
                  padding: '0.5rem'
                }}
              />
            </>
          ) : (
            <>
              <h1 className={styles.sloganMain}>
                {pageContent?.sloganMain?.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < pageContent.sloganMain.split('\n').length - 1 && <br />}
                  </span>
                )) || (
                  <>
                    AI 기반 자동화 솔루션으로<br />
                    <span className={styles.sloganHighlight}>생산성을 높이고</span> 업무의 새로운 경험을 제공합니다
                  </>
                )}
              </h1>
              <p className={styles.sloganSubtext}>
                {pageContent?.sloganSubtext || '가장 똑똑하고 빠르고 실용적인 AI 모델이 탑재되어 더욱 깊이 있게 사고합니다. 이제 누구나 사용할 수 있습니다.'}
              </p>
            </>
          )}
          <div className={styles.sloganActions}>
            <button 
              onClick={() => {
                const token = getToken();
                if (token) {
                  // 로그인된 경우 aillm 페이지로 이동
                  router.push('/aillm');
                } else {
                  // 로그인되지 않은 경우 모달 열기
                  setShowLoginModal(true);
                }
              }}
              className={styles.sloganButtonPrimary}
            >
              시작하기 <span className={styles.chevron}>›</span>
            </button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className={styles.mainContentSection}>
        <div className={styles.mainContentContainer}>
          {isEditMode && isAdminUser ? (
            <input
              type="text"
              value={pageContent?.mainDescriptionTitle || 'Custom Ai 제공되는 다양기능을 만나보세요'}
              onChange={(e) => {
                const newContent = { ...pageContent, mainDescriptionTitle: e.target.value };
                setPageContent(newContent);
                saveContent(newContent);
              }}
              className={styles.editInput}
              style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', width: '100%', padding: '0.5rem' }}
            />
          ) : (
            <h2 className={styles.mainDescriptionTitle}>
              {pageContent?.mainDescriptionTitle || 'Custom Ai 제공되는 다양기능을 만나보세요'}
            </h2>
          )}
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

          {/* 뉴스/특허/자격 섹션은 /news 페이지로 이동됨 */}

          {/* Custom Ai 포커스 섹션 */}
          <div className={styles.customAiSection}>
            <div className={styles.customAiContainer}>
              <div className={styles.customAiTopSection}>
                <div className={styles.customAiBorderLine}></div>
                <div className={styles.customAiTopText}>
                "Why"Custom Ai Should I start "now"?
                </div>
              </div>
              <div className={styles.customAiFocus}>
                <p className={styles.customAiLabel}>Custom Ai를</p>
                <h2 className={styles.customAiTitle}>
                  <span className={styles.customAiTitleLine1}>비용을 줄여주는 설계도</span>
                  <span className={styles.customAiTitleLine2}>부담 없이 도입 시작</span>
                </h2>
                <p className={styles.customAiSubtext}>
                  <span className={styles.customAiSubtextLine1}>Ai 자동화는 '언젠가' 아니라</span>
                  <span className={styles.customAiSubtextLine2}> '지금' 시작할수록 비용이 줄어듭니다</span>
                </p>
              </div>
              <div className={styles.customAiImagePlaceholder}>
              </div>
            </div>
          </div>

          {/* Why 섹션 - 3개 카드 아래, 요금제 바로 전 */}
          <div className={styles.whySection}>
            <div className={styles.whyContainer}>
              {/* 메인 타이틀 */}
              <div className={styles.whyTitleSection}>
                <h2 className={styles.whyMainTitle}>
                  내용 생각중입니다 들어갈거 생각해야함
                </h2>         
              </div>

              {/* 이미지 왼쪽, 텍스트 오른쪽 (2컬럼) */}
              <div className={styles.whyImageTextRow}>
                <div className={styles.whyImageColumn}>
                  <div className={styles.whyImagePlaceholder}>
                    {/* 이미지 영역 - 추후 이미지 추가 예정 */}
                    <div className={styles.whyImageContent}>
                      {/* 인건비, 운영비, 생산성 차트 이미지 영역 */}
                    </div>
                  </div>
                </div>
                <div className={styles.whyTextColumn}>
                  <div className={styles.whyTextContent}>
                    <h3 className={styles.whyTextTitle}>AI 자동화의 효과</h3>
                    <p>
                      AI 자동화를 도입하면 업무 효율성이 크게 향상됩니다. 반복적인 작업을 자동화하여 
                      인력이 더 중요한 업무에 집중할 수 있게 됩니다. 이를 통해 생산성을 높이고 
                      비용을 절감할 수 있습니다.
                    </p>
                    <p>
                      초기 투자 비용이 있더라도 장기적으로 보면 인건비 절감과 업무 효율 향상으로 
                      투자 대비 효과가 큽니다. 특히 업무량이 지속적으로 증가하는 환경에서는 
                      자동화 도입이 필수적입니다.
                    </p>
                    <p>
                      빠른 시장 변화에 대응하기 위해서는 신속한 의사결정과 업무 처리가 필요합니다. 
                      AI 자동화는 이러한 요구사항을 충족시켜 경쟁력을 강화할 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 하단 2컬럼 텍스트 */}
              <div className={styles.whyBottomTextRow}>
                <div className={styles.whyBottomTextColumn}>
                  <div className={styles.whyBottomTextContent}>
                    <h3>비용 절감 효과</h3>
                    <p>
                      AI 자동화를 통해 반복 업무를 처리하면 인건비를 크게 절감할 수 있습니다. 
                      특히 대량의 데이터 처리나 문서 작업에서 그 효과가 두드러집니다.
                    </p>
                    <p>
                      자동화된 프로세스는 24시간 무인으로 작동할 수 있어 업무 처리 시간을 
                      단축하고 인력 배치를 최적화할 수 있습니다.
                    </p>
                  </div>
                </div>
                <div className={styles.whyBottomTextColumn}>
                  <div className={styles.whyBottomTextContent}>
                    <h3>생산성 향상</h3>
                    <p>
                      자동화를 통해 사람은 창의적이고 전략적인 업무에 집중할 수 있습니다. 
                      이는 조직 전체의 생산성 향상으로 이어집니다.
                    </p>
                    <p>
                      업무 처리 속도가 빨라지고 오류가 줄어들어 고객 만족도가 향상되고, 
                      이를 통해 비즈니스 성장을 가속화할 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 요금제 카드 4개 */}
          <div className={styles.pricingSection} style={{ position: 'relative' }}>
            {isAdminUser && (
              <button
                onClick={() => {
                  // 편집 시작 시 원본 데이터 저장
                  if (pageContent) {
                    setOriginalPageContent(JSON.parse(JSON.stringify(pageContent)));
                  }
                  if (!pageContent?.pricing) {
                    const defaultPricing = {
                      title: '요금제',
                      subtitle: '필요한 만큼 선택하고, 확장하면서 비용을 최적화하세요.',
                      plans: pricingPlans,
                      brandPromise: {
                        title: '일이 매끄럽게 흐르는 경험',
                        description: '반복은 자동화로, 판단은 사람에게. 팀이 핵심 업무에 집중하도록 설계합니다.',
                        pills: ['빠르게', '정확하게', '안전하게']
                      },
                      roi: {
                        title: '한 번의 도입, 매달 반복되는 절감',
                        stats: [
                          { value: '166h', label: '월 절감 시간(예시)' },
                          { value: '2m', label: '건당 절감(예시)' },
                          { value: '5,000', label: '월 처리량(예시)' }
                        ],
                        example: '예: 월 5,000건 × 건당 2분 절감 = <strong>166시간/월</strong>',
                        note: '* 예시는 업무/프로세스/처리량에 따라 달라질 수 있습니다.'
                      }
                    };
                    setPageContent({ ...pageContent, pricing: defaultPricing });
                  }
                  setEditingPricing(true);
                }}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  padding: '0.5rem 1rem',
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  zIndex: 10
                }}
              >
                수정
              </button>
            )}
            {editingPricing && isAdminUser && (
              <button
                onClick={async () => {
                  const success = await saveContent(pageContent);
                  if (success) {
                    setEditingPricing(false);
                  }
                }}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '80px',
                  padding: '0.5rem 1rem',
                  background: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  zIndex: 10
                }}
              >
                저장
              </button>
            )}
            {editingPricing && isAdminUser && (
              <button
                onClick={() => {
                  setEditingPricing(false);
                  // 원본 데이터로 복원
                  if (originalPageContent) {
                    setPageContent(JSON.parse(JSON.stringify(originalPageContent)));
                  }
                }}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '140px',
                  padding: '0.5rem 1rem',
                  background: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  zIndex: 10
                }}
              >
                취소
              </button>
            )}
            <div className={styles.pricingHeader}>
              {editingPricing && isAdminUser ? (
                <>
                  <input
                    type="text"
                    value={pageContent?.pricing?.title || '요금제'}
                    onChange={(e) => {
                      if (!pageContent?.pricing) {
                        setPageContent({ 
                          ...pageContent, 
                          pricing: {
                            title: e.target.value,
                            subtitle: '필요한 만큼 선택하고, 확장하면서 비용을 최적화하세요.',
                            plans: pricingPlans,
                            brandPromise: {
                              title: '일이 매끄럽게 흐르는 경험',
                              description: '반복은 자동화로, 판단은 사람에게. 팀이 핵심 업무에 집중하도록 설계합니다.',
                              pills: ['빠르게', '정확하게', '안전하게']
                            },
                            roi: {
                              title: '한 번의 도입, 매달 반복되는 절감',
                              stats: [
                                { value: '166h', label: '월 절감 시간(예시)' },
                                { value: '2m', label: '건당 절감(예시)' },
                                { value: '5,000', label: '월 처리량(예시)' }
                              ],
                              example: '예: 월 5,000건 × 건당 2분 절감 = <strong>166시간/월</strong>',
                              note: '* 예시는 업무/프로세스/처리량에 따라 달라질 수 있습니다.'
                            }
                          }
                        });
                      } else {
                        setPageContent({ 
                          ...pageContent, 
                          pricing: { 
                            ...pageContent.pricing, 
                            title: e.target.value 
                          } 
                        });
                      }
                    }}
                    className={styles.editInput}
                    style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', width: '100%', padding: '0.5rem' }}
                  />
                  <textarea
                    value={pageContent?.pricing?.subtitle || '필요한 만큼 선택하고, 확장하면서 비용을 최적화하세요.'}
                    onChange={(e) => {
                      if (!pageContent?.pricing) {
                        setPageContent({ 
                          ...pageContent, 
                          pricing: {
                            title: '요금제',
                            subtitle: e.target.value,
                            plans: pricingPlans,
                            brandPromise: {
                              title: '일이 매끄럽게 흐르는 경험',
                              description: '반복은 자동화로, 판단은 사람에게. 팀이 핵심 업무에 집중하도록 설계합니다.',
                              pills: ['빠르게', '정확하게', '안전하게']
                            },
                            roi: {
                              title: '한 번의 도입, 매달 반복되는 절감',
                              stats: [
                                { value: '166h', label: '월 절감 시간(예시)' },
                                { value: '2m', label: '건당 절감(예시)' },
                                { value: '5,000', label: '월 처리량(예시)' }
                              ],
                              example: '예: 월 5,000건 × 건당 2분 절감 = <strong>166시간/월</strong>',
                              note: '* 예시는 업무/프로세스/처리량에 따라 달라질 수 있습니다.'
                            }
                          }
                        });
                      } else {
                        setPageContent({ 
                          ...pageContent, 
                          pricing: { 
                            ...pageContent.pricing, 
                            subtitle: e.target.value 
                          } 
                        });
                      }
                    }}
                    className={styles.editInput}
                    style={{ width: '100%', minHeight: '60px', padding: '0.5rem' }}
                  />
                </>
              ) : (
                <>
                  <h2 className={styles.pricingTitle}>
                    {pageContent?.pricing?.title || '요금제'}
                  </h2>
                  <p className={styles.pricingSubtitle}>
                    {pageContent?.pricing?.subtitle || '필요한 만큼 선택하고, 확장하면서 비용을 최적화하세요.'}
                  </p>
                </>
              )}
            </div>
            <div className={styles.pricingGrid}>
              {(() => {
                const savedPlans = pageContent?.pricing?.plans;
                const hasPremium = savedPlans?.some(plan => plan.key === 'premium');
                const hasFourPlans = savedPlans?.length >= 4;
                // 저장된 plans가 4개 미만이거나 premium이 없으면 기본 pricingPlans 사용
                return (savedPlans && hasFourPlans && hasPremium) ? savedPlans : pricingPlans;
              })().map((plan, planIdx) => {
                // 편집 모드에서도 동일한 plans 사용
                const savedPlans = pageContent?.pricing?.plans;
                const hasPremium = savedPlans?.some(p => p.key === 'premium');
                const hasFourPlans = savedPlans?.length >= 4;
                const currentPlans = (savedPlans && hasFourPlans && hasPremium) ? savedPlans : pricingPlans;
                return (
                <div
                  key={plan.key}
                  className={`${styles.pricingCard} ${
                    plan.highlight ? styles.pricingCardHighlight : ''
                  }`}
                >
                  {plan.highlight && <div className={styles.pricingBadge}>추천</div>}
                  <div className={styles.pricingCardTop}>
                    {editingPricing && isAdminUser ? (
                      <>
                        <input
                          type="text"
                          value={plan.name}
                          onChange={(e) => {
                            const newPlans = [...currentPlans];
                            newPlans[planIdx] = { ...newPlans[planIdx], name: e.target.value };
                            setPageContent({ 
                              ...pageContent, 
                              pricing: { 
                                ...(pageContent?.pricing || {}), 
                                plans: newPlans 
                              } 
                            });
                          }}
                          className={styles.editInput}
                          style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem', fontSize: '1.375rem', fontWeight: 'bold' }}
                        />
                        <textarea
                          value={plan.description}
                          onChange={(e) => {
                            const newPlans = [...currentPlans];
                            newPlans[planIdx] = { ...newPlans[planIdx], description: e.target.value };
                            setPageContent({ 
                              ...pageContent, 
                              pricing: { 
                                ...(pageContent?.pricing || {}), 
                                plans: newPlans 
                              } 
                            });
                          }}
                          className={styles.editInput}
                          style={{ width: '100%', minHeight: '40px', padding: '0.5rem', fontSize: '0.875rem' }}
                        />
                      </>
                    ) : (
                      <>
                        <h3 className={styles.pricingCardName}>{plan.name}</h3>
                        <p className={styles.pricingCardDesc}>{plan.description}</p>
                      </>
                    )}
                  </div>
                  <div className={styles.pricingPriceRow}>
                    {editingPricing && isAdminUser ? (
                      <>
                        <input
                          type="text"
                          value={plan.price}
                          onChange={(e) => {
                            const newPlans = [...currentPlans];
                            newPlans[planIdx] = { ...newPlans[planIdx], price: e.target.value };
                            setPageContent({ 
                              ...pageContent, 
                              pricing: { 
                                ...(pageContent?.pricing || {}), 
                                plans: newPlans 
                              } 
                            });
                          }}
                          className={styles.editInput}
                          style={{ width: '100px', padding: '0.5rem', fontSize: '2.125rem', fontWeight: 'bold' }}
                        />
                        <input
                          type="text"
                          value={plan.period || ''}
                          onChange={(e) => {
                            const newPlans = [...currentPlans];
                            newPlans[planIdx] = { ...newPlans[planIdx], period: e.target.value };
                            setPageContent({ 
                              ...pageContent, 
                              pricing: { 
                                ...(pageContent?.pricing || {}), 
                                plans: newPlans 
                              } 
                            });
                          }}
                          className={styles.editInput}
                          style={{ width: '60px', padding: '0.5rem', fontSize: '0.875rem' }}
                          placeholder="/월"
                        />
                      </>
                    ) : (
                      <>
                        <span className={styles.pricingPrice}>{plan.price}</span>
                        {plan.period && (
                          <>
                            <span className={styles.pricingCurrency}>₩</span>
                            <span className={styles.pricingPeriod}>{plan.period}</span>
                          </>
                        )}
                      </>
                    )}
                  </div>
                  <ul className={styles.pricingList}>
                    {plan.features.map((f, featureIdx) => (
                      <li key={featureIdx}>
                        {editingPricing && isAdminUser ? (
                          <input
                            type="text"
                            value={f}
                            onChange={(e) => {
                              const newPlans = [...currentPlans];
                              const newFeatures = [...newPlans[planIdx].features];
                              newFeatures[featureIdx] = e.target.value;
                              newPlans[planIdx] = { ...newPlans[planIdx], features: newFeatures };
                              setPageContent({ 
                                ...pageContent, 
                                pricing: { 
                                  ...(pageContent?.pricing || {}), 
                                  plans: newPlans 
                                } 
                              });
                            }}
                            className={styles.editInput}
                            style={{ width: '100%', padding: '0.25rem', fontSize: '0.875rem', marginBottom: '0.25rem' }}
                          />
                        ) : (
                          f
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className={styles.pricingActions}>
                    {plan.key === 'enterprise' ? (
                      <button className={styles.pricingButtonSecondary} type="button">
                        상담 요청
                      </button>
                    ) : (
                      <button 
                        className={styles.pricingButtonPrimary} 
                        type="button"
                        onClick={() => {
                          const currentUser = getUser();
                          if (currentUser) {
                            // 로그인한 경우 마이페이지로 이동
                            router.push('/payment');
                          } else {
                            // 로그인하지 않은 경우 로그인 페이지로 이동
                            router.push('/login');
                          }
                        }}
                      >
                        {plan.name} 시작 <span className={styles.arrowUpRight}>↗</span>
                      </button>
                    )}
                  </div>
                </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </AppShell>
    <LoginModal
      isOpen={showLoginModal}
      onClose={() => setShowLoginModal(false)}
      onSuccess={() => {
        // 로그인 성공 후 현재 페이지 유지
        // 페이지 새로고침으로 로그인 상태 반영
        window.location.reload();
      }}
    />
    {selectedFeature && (
      <div 
        className={styles.modalOverlay}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedFeature(null);
          }
        }}
      >
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
                <p className={styles.modalEyebrow}>FEATURE</p>
                <h2 className={styles.modalTitle}>
                  {featureDescriptions[selectedFeature]?.title || selectedFeature}
                </h2>
              </div>
            </div>
            <div className={styles.modalBody}>
              {renderModalBody()}
            </div>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
