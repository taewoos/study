import { connectDB } from '@/utils/db';
import { verifyUser } from '@/utils/authServer';

// RPA 알림 관리 API
export default async function handler(req, res) {
  const client = await connectDB();
  if (!client) {
    return res.status(500).json({ error: '데이터베이스 연결에 실패했습니다.' });
  }
  const db = client.db('study');
  const notificationsCollection = db.collection('rpa_notifications');

  if (req.method === 'GET') {
    try {
      // 사용자 인증 확인
      const userCheck = await verifyUser(req);
      if (!userCheck.authenticated) {
        return res.status(401).json({ error: userCheck.error || '인증이 필요합니다.' });
      }

      const { read } = req.query;
      const userId = userCheck.user.userId || userCheck.user.email;
      const userObjectId = userCheck.user._id;

      // 알림 조회 조건
      const query = {
        $or: [
          { userId: userId },
          { email: userCheck.user.email },
          { userObjectId: userObjectId }
        ]
      };

      // 읽음/안읽음 필터링
      if (read !== undefined) {
        query.read = read === 'true';
      }

      // 알림 조회 (최신순)
      const notifications = await notificationsCollection
        .find(query)
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray();

      // MongoDB ObjectId를 문자열로 변환
      const formattedNotifications = notifications.map(notification => ({
        id: notification._id.toString(),
        type: notification.type || 'info',
        title: notification.title,
        message: notification.message,
        projectId: notification.projectId || null,
        taskId: notification.taskId || null,
        read: notification.read || false,
        createdAt: notification.createdAt
      }));

      // 안읽음 알림 개수
      const unreadCount = await notificationsCollection.countDocuments({
        ...query,
        read: false
      });

      return res.status(200).json({
        notifications: formattedNotifications,
        unreadCount: unreadCount
      });
    } catch (error) {
      console.error('RPA notifications fetch error:', error);
      return res.status(500).json({ error: '알림을 불러오는데 실패했습니다.' });
    }
  }

  if (req.method === 'PUT') {
    try {
      // 사용자 인증 확인
      const userCheck = await verifyUser(req);
      if (!userCheck.authenticated) {
        return res.status(401).json({ error: userCheck.error || '인증이 필요합니다.' });
      }

      const { notificationId, read, markAllAsRead } = req.body;
      const userId = userCheck.user.userId || userCheck.user.email;
      const userObjectId = userCheck.user._id;

      if (markAllAsRead) {
        // 모든 알림을 읽음으로 표시
        const result = await notificationsCollection.updateMany(
          {
            $or: [
              { userId: userId },
              { email: userCheck.user.email },
              { userObjectId: userObjectId }
            ],
            read: false
          },
          {
            $set: { read: true, readAt: new Date().toISOString() }
          }
        );

        return res.status(200).json({
          message: `${result.modifiedCount}개의 알림이 읽음으로 표시되었습니다.`,
          modifiedCount: result.modifiedCount
        });
      }

      if (notificationId) {
        // 특정 알림 읽음 처리
        const result = await notificationsCollection.updateOne(
          {
            _id: require('mongodb').ObjectId(notificationId),
            $or: [
              { userId: userId },
              { email: userCheck.user.email },
              { userObjectId: userObjectId }
            ]
          },
          {
            $set: {
              read: read !== undefined ? read : true,
              readAt: new Date().toISOString()
            }
          }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ error: '알림을 찾을 수 없습니다.' });
        }

        return res.status(200).json({ message: '알림이 업데이트되었습니다.' });
      }

      return res.status(400).json({ error: 'notificationId 또는 markAllAsRead가 필요합니다.' });
    } catch (error) {
      console.error('RPA notification update error:', error);
      return res.status(500).json({ error: '알림 업데이트에 실패했습니다.' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      // 사용자 인증 확인
      const userCheck = await verifyUser(req);
      if (!userCheck.authenticated) {
        return res.status(401).json({ error: userCheck.error || '인증이 필요합니다.' });
      }

      const { notificationId } = req.query;
      const userId = userCheck.user.userId || userCheck.user.email;
      const userObjectId = userCheck.user._id;

      if (!notificationId) {
        return res.status(400).json({ error: 'notificationId가 필요합니다.' });
      }

      const { ObjectId } = require('mongodb');
      if (!ObjectId.isValid(notificationId)) {
        return res.status(400).json({ error: '유효하지 않은 알림 ID입니다.' });
      }

      // 알림 삭제
      const result = await notificationsCollection.deleteOne({
        _id: new ObjectId(notificationId),
        $or: [
          { userId: userId },
          { email: userCheck.user.email },
          { userObjectId: userObjectId }
        ]
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: '알림을 찾을 수 없습니다.' });
      }

      return res.status(200).json({ message: '알림이 삭제되었습니다.' });
    } catch (error) {
      console.error('RPA notification delete error:', error);
      return res.status(500).json({ error: '알림 삭제에 실패했습니다.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
