import { connectDB } from '@/utils/db';
import { verifyUser } from '@/utils/authServer';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'DELETE') {
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
    const conversationsCollection = db.collection('aillm_conversations');

    if (req.method === 'GET') {
      // 대화방 목록 조회
      const conversations = await conversationsCollection
        .find({ userId })
        .sort({ updatedAt: -1 })
        .toArray();

      return res.status(200).json(conversations);
    }

    if (req.method === 'POST') {
      // 새 대화방 생성
      const { title, lastMessage } = req.body;

      if (!title) {
        return res.status(400).json({ error: '제목이 필요합니다.' });
      }

      const conversation = {
        userId,
        title,
        lastMessage: lastMessage || '',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await conversationsCollection.insertOne(conversation);
      return res.status(201).json({ ...conversation, _id: result.insertedId });
    }

    if (req.method === 'PUT') {
      // 대화방 업데이트
      const { id, title, lastMessage, messages } = req.body;

      if (!id) {
        return res.status(400).json({ error: '대화방 ID가 필요합니다.' });
      }

      const updateData = {
        updatedAt: new Date(),
      };

      if (title !== undefined) updateData.title = title;
      if (lastMessage !== undefined) updateData.lastMessage = lastMessage;
      if (messages !== undefined) updateData.messages = messages;

      const result = await conversationsCollection.updateOne(
        { _id: new ObjectId(id), userId },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: '대화방을 찾을 수 없습니다.' });
      }

      return res.status(200).json({ message: '대화방이 업데이트되었습니다.' });
    }

    if (req.method === 'DELETE') {
      // 대화방 삭제
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: '대화방 ID가 필요합니다.' });
      }

      const result = await conversationsCollection.deleteOne({
        _id: new ObjectId(id),
        userId,
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: '대화방을 찾을 수 없습니다.' });
      }

      return res.status(200).json({ message: '대화방이 삭제되었습니다.' });
    }
  } catch (error) {
    console.error('Conversations API error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}
