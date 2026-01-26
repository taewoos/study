import { connectDB } from '@/utils/db';
import { verifyUser } from '@/utils/authServer';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 사용자 인증 확인
    const userCheck = await verifyUser(req);
    if (!userCheck.authenticated) {
      return res.status(401).json({ error: userCheck.error || '인증이 필요합니다.' });
    }

    const userId = userCheck.user.userId || userCheck.user.email;
    const client = await connectDB();
    if (!client) {
      return res.status(500).json({ error: '데이터베이스 연결에 실패했습니다.' });
    }
    const db = client.db('study');
    const embeddingsCollection = db.collection('embeddings');

    // 통계 정보 조회
    const totalDocuments = await embeddingsCollection.countDocuments({ userId });
    const completedDocuments = await embeddingsCollection.countDocuments({
      userId,
      status: 'completed',
    });
    const processingDocuments = await embeddingsCollection.countDocuments({
      userId,
      status: 'processing',
    });
    const failedDocuments = await embeddingsCollection.countDocuments({
      userId,
      status: 'failed',
    });

    // 총 청크 수 계산
    const documents = await embeddingsCollection
      .find({ userId })
      .project({ chunkCount: 1 })
      .toArray();
    const totalChunks = documents.reduce((sum, doc) => sum + (doc.chunkCount || 0), 0);

    // 총 저장 용량 계산
    const sizeDocuments = await embeddingsCollection
      .find({ userId })
      .project({ fileSize: 1 })
      .toArray();
    const totalSize = sizeDocuments.reduce((sum, doc) => sum + (doc.fileSize || 0), 0);

    return res.status(200).json({
      totalDocuments,
      completedDocuments,
      processingDocuments,
      failedDocuments,
      totalChunks,
      totalSize,
    });
  } catch (error) {
    console.error('Embedding stats API error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}
