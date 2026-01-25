import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { verifyAdmin } from '@/utils/authServer';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 관리자 권한 확인
    const adminCheck = await verifyAdmin(req);
    if (!adminCheck.isAdmin) {
      return res.status(403).json({ error: adminCheck.error || '관리자 권한이 필요합니다.' });
    }

    const { file, fileName } = req.body;

    if (!file || !fileName) {
      return res.status(400).json({ error: '파일이 필요합니다.' });
    }

    // base64 데이터에서 실제 데이터 추출
    const base64Data = file.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // 업로드 디렉토리 경로
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    // 디렉토리가 없으면 생성
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // 파일명에 타임스탬프 추가하여 중복 방지
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const finalFileName = `${timestamp}_${sanitizedFileName}`;
    const filePath = join(uploadDir, finalFileName);

    // 파일 저장
    await writeFile(filePath, buffer);

    // URL 경로 반환
    const fileUrl = `/uploads/${finalFileName}`;

    return res.status(200).json({ 
      success: true,
      url: fileUrl,
      fileName: finalFileName
    });
  } catch (error) {
    console.error('File upload error:', error);
    return res.status(500).json({ error: '파일 업로드에 실패했습니다.' });
  }
}
