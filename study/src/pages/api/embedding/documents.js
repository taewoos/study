import { connectDB } from '@/utils/db';
import { verifyUser } from '@/utils/authServer';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST' && req.method !== 'DELETE') {
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

    if (req.method === 'GET') {
      // 사용자 임베딩 문서 목록 조회
      const { page = 1, limit = 20 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const documents = await embeddingsCollection
        .find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray();

      const total = await embeddingsCollection.countDocuments({ userId });

      const formatted = documents.map((doc) => ({
        id: doc._id.toString(),
        title: doc.title,
        fileName: doc.fileName,
        fileType: doc.fileType,
        fileSize: doc.fileSize,
        status: doc.status || 'processing', // processing, completed, failed
        chunkCount: doc.chunkCount || 0,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }));

      return res.status(200).json({
        documents: formatted,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      });
    }

    if (req.method === 'POST') {
      // 새 문서 임베딩 등록
      const { title, fileName, fileType, fileSize, fileUrl } = req.body;

      if (!title || !fileName) {
        return res.status(400).json({ error: '제목과 파일명이 필요합니다.' });
      }

      const document = {
        userId,
        title: title.trim(),
        fileName,
        fileType: fileType || 'unknown',
        fileSize: fileSize || 0,
        fileUrl: fileUrl || null,
        status: 'processing',
        chunkCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await embeddingsCollection.insertOne(document);
      return res.status(201).json({
        id: result.insertedId.toString(),
        ...document,
      });
    }

    if (req.method === 'DELETE') {
      // 임베딩 문서 삭제
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: '문서 ID가 필요합니다.' });
      }

      const result = await embeddingsCollection.deleteOne({
        _id: new ObjectId(id),
        userId,
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: '문서를 찾을 수 없습니다.' });
      }

      return res.status(200).json({ message: '문서가 삭제되었습니다.' });
    }
  } catch (error) {
    console.error('Embedding documents API error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}
