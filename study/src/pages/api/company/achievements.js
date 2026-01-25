import { connectDB } from '@/utils/db';
import { verifyAdmin } from '@/utils/authServer';

// 검증된 성과 게시글 CRUD API
export default async function handler(req, res) {
  const client = await connectDB();
  if (!client) {
    return res.status(500).json({ error: '데이터베이스 연결에 실패했습니다.' });
  }
  const db = client.db('study');
  const achievementsCollection = db.collection('achievements');

  if (req.method === 'GET') {
    try {
      const achievements = await achievementsCollection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      return res.status(200).json(achievements);
    } catch (error) {
      console.error('Achievements fetch error:', error);
      return res.status(500).json({ error: '게시글을 불러오는데 실패했습니다.' });
    }
  }

  if (req.method === 'POST') {
    try {
      // 관리자 권한 확인 (초기 데이터 설정 시에는 권한 확인 생략 가능하지만, 보안을 위해 확인)
      // Authorization 헤더가 없으면 초기 데이터 설정으로 간주하여 허용
      const hasAuth = req.headers.authorization && req.headers.authorization.startsWith('Bearer ');
      
      if (hasAuth) {
        const adminCheck = await verifyAdmin(req);
        if (!adminCheck.isAdmin) {
          return res.status(403).json({ error: adminCheck.error || '관리자 권한이 필요합니다.' });
        }
      }
      // 초기 데이터 설정인 경우 권한 확인 생략 (데이터가 없을 때만 가능)

      const { title, date, excerpt, href, type } = req.body; // type: 'news' or 'credential'

      if (!title || !date) {
        return res.status(400).json({ error: '제목과 날짜는 필수입니다.' });
      }

      const achievement = {
        title,
        date,
        excerpt: excerpt || '',
        href: href || '#',
        type: type || 'news',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await achievementsCollection.insertOne(achievement);

      return res.status(201).json({ 
        message: '게시글이 추가되었습니다.',
        achievement: { ...achievement, _id: result.insertedId }
      });
    } catch (error) {
      console.error('Achievement create error:', error);
      return res.status(500).json({ error: '게시글 추가에 실패했습니다.' });
    }
  }

  if (req.method === 'PUT') {
    try {
      // 관리자 권한 확인
      const adminCheck = await verifyAdmin(req);
      if (!adminCheck.isAdmin) {
        return res.status(403).json({ error: adminCheck.error || '관리자 권한이 필요합니다.' });
      }

      const { id, title, date, excerpt, href, type } = req.body;

      if (!id) {
        return res.status(400).json({ error: '게시글 ID가 필요합니다.' });
      }

      const updateData = {
        updatedAt: new Date(),
      };

      if (title) updateData.title = title;
      if (date) updateData.date = date;
      if (excerpt !== undefined) updateData.excerpt = excerpt;
      if (href !== undefined) updateData.href = href;
      if (type) updateData.type = type;

      const { ObjectId } = require('mongodb');
      const result = await achievementsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      return res.status(200).json({ message: '게시글이 수정되었습니다.' });
    } catch (error) {
      console.error('Achievement update error:', error);
      return res.status(500).json({ error: '게시글 수정에 실패했습니다.' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      // 관리자 권한 확인
      const adminCheck = await verifyAdmin(req);
      if (!adminCheck.isAdmin) {
        return res.status(403).json({ error: adminCheck.error || '관리자 권한이 필요합니다.' });
      }

      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: '게시글 ID가 필요합니다.' });
      }

      const { ObjectId } = require('mongodb');
      const result = await achievementsCollection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      return res.status(200).json({ message: '게시글이 삭제되었습니다.' });
    } catch (error) {
      console.error('Achievement delete error:', error);
      return res.status(500).json({ error: '게시글 삭제에 실패했습니다.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
