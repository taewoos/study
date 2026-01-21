'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';

// CSS는 클라이언트에서만 동적으로 로드
if (typeof window !== 'undefined') {
  import('react-quill-new/dist/quill.snow.css').catch(() => {});
}

// Next.js에서 SSR 오류를 피하기 위해 dynamic import 사용
const ReactQuill = dynamic(
  () => import('react-quill-new').then((mod) => mod.default || mod),
  { 
    ssr: false,
    loading: () => <div style={{ padding: '10px' }}>로딩 중...</div>
  }
);

const toolbarOptions = [
  [{ font: [] }],
  [{ size: ['small', false, 'large', 'huge'] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ header: 1 }, { header: 2 }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ align: [] }],
  ['clean'],
];

const modules = {
  toolbar: toolbarOptions,
};

export function RichTextEditor({ value, onChange, className, placeholder }) {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      className={className}
      placeholder={placeholder}
    />
  );
}

