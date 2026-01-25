import { connectDB } from '@/utils/db';
import { verifyUser } from '@/utils/authServer';
import { ObjectId } from 'mongodb';

// RPA Task(카드) 관리 API
export default async function handler(req, res) {
  const client = await connectDB();
  if (!client) {
    return res.status(500).json({ error: '데이터베이스 연결에 실패했습니다.' });
  }
  const db = client.db('study');
  const tasksCollection = db.collection('rpa_tasks');
  const projectsCollection = db.collection('rpa_projects');

  if (req.method === 'POST') {
    try {
      // 사용자 인증 확인
      const userCheck = await verifyUser(req);
      if (!userCheck.authenticated) {
        return res.status(401).json({ error: userCheck.error || '인증이 필요합니다.' });
      }

      const { projectId, label, status, imageUrl, sshKey } = req.body;

      // 필수 필드 검증
      if (!projectId || !label) {
        return res.status(400).json({ error: '프로젝트 ID와 라벨을 입력해주세요.' });
      }

      // 프로젝트 소유권 확인
      if (!ObjectId.isValid(projectId)) {
        return res.status(400).json({ error: '유효하지 않은 프로젝트 ID입니다.' });
      }

      let project = await projectsCollection.findOne({
        _id: new ObjectId(projectId),
        $or: [
          { userId: userCheck.user.userId },
          { email: userCheck.user.email },
          { userObjectId: userCheck.user._id }
        ]
      });

      // 프로젝트가 없으면 자동으로 생성
      if (!project) {
        const newProject = {
          _id: new ObjectId(projectId),
          userId: userCheck.user.userId || userCheck.user.email,
          email: userCheck.user.email,
          userObjectId: userCheck.user._id,
          title: '새 프로젝트',
          description: '',
          status: 'active',
          date: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        try {
          await projectsCollection.insertOne(newProject);
          project = newProject;
        } catch (error) {
          // 이미 존재하는 경우 다시 조회
          project = await projectsCollection.findOne({ _id: new ObjectId(projectId) });
          if (!project) {
            return res.status(500).json({ error: '프로젝트 생성에 실패했습니다.' });
          }
        }
      }

      // 새 Task 생성
      const newTask = {
        projectId: projectId,
        label: label.trim(),
        status: status || 'ready',
        imageUrl: imageUrl || null,
        sshKey: sshKey || null,
        time: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const result = await tasksCollection.insertOne(newTask);

      // 생성된 Task 반환
      const createdTask = {
        id: result.insertedId.toString(),
        projectId: newTask.projectId,
        label: newTask.label,
        status: newTask.status,
        time: newTask.time,
        imageUrl: newTask.imageUrl,
        sshKey: newTask.sshKey,
        createdAt: newTask.createdAt,
        updatedAt: newTask.updatedAt
      };

      return res.status(201).json(createdTask);
    } catch (error) {
      console.error('RPA task create error:', error);
      return res.status(500).json({ error: 'Task 생성에 실패했습니다.' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      // 사용자 인증 확인
      const userCheck = await verifyUser(req);
      if (!userCheck.authenticated) {
        return res.status(401).json({ error: userCheck.error || '인증이 필요합니다.' });
      }

      const { taskId, projectId } = req.query;

      if (!taskId || !projectId) {
        return res.status(400).json({ error: 'Task ID와 프로젝트 ID가 필요합니다.' });
      }

      // ObjectId 유효성 검사
      if (!ObjectId.isValid(taskId) || !ObjectId.isValid(projectId)) {
        return res.status(400).json({ error: '유효하지 않은 ID입니다.' });
      }

      // 프로젝트 소유권 확인
      let project = await projectsCollection.findOne({
        _id: new ObjectId(projectId),
        $or: [
          { userId: userCheck.user.userId },
          { email: userCheck.user.email },
          { userObjectId: userCheck.user._id }
        ]
      });

      // 프로젝트가 없으면 자동으로 생성
      if (!project) {
        const newProject = {
          _id: new ObjectId(projectId),
          userId: userCheck.user.userId || userCheck.user.email,
          email: userCheck.user.email,
          userObjectId: userCheck.user._id,
          title: '새 프로젝트',
          description: '',
          status: 'active',
          date: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        try {
          await projectsCollection.insertOne(newProject);
          project = newProject;
        } catch (error) {
          // 이미 존재하는 경우 다시 조회
          project = await projectsCollection.findOne({ _id: new ObjectId(projectId) });
          if (!project) {
            return res.status(500).json({ error: '프로젝트 생성에 실패했습니다.' });
          }
        }
      }

      // Task 삭제
      const result = await tasksCollection.deleteOne({
        _id: new ObjectId(taskId),
        projectId: projectId
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Task를 찾을 수 없습니다.' });
      }

      return res.status(200).json({ message: 'Task가 삭제되었습니다.' });
    } catch (error) {
      console.error('RPA task delete error:', error);
      return res.status(500).json({ error: 'Task 삭제에 실패했습니다.' });
    }
  }

  if (req.method === 'PUT') {
    try {
      // 사용자 인증 확인
      const userCheck = await verifyUser(req);
      if (!userCheck.authenticated) {
        return res.status(401).json({ error: userCheck.error || '인증이 필요합니다.' });
      }

      const { taskId, projectId, label, status, imageUrl, sshKey } = req.body;

      if (!taskId || !projectId) {
        return res.status(400).json({ error: 'Task ID와 프로젝트 ID가 필요합니다.' });
      }

      // ObjectId 유효성 검사
      if (!ObjectId.isValid(taskId) || !ObjectId.isValid(projectId)) {
        return res.status(400).json({ error: '유효하지 않은 ID입니다.' });
      }

      // 프로젝트 소유권 확인
      let project = await projectsCollection.findOne({
        _id: new ObjectId(projectId),
        $or: [
          { userId: userCheck.user.userId },
          { email: userCheck.user.email },
          { userObjectId: userCheck.user._id }
        ]
      });

      // 프로젝트가 없으면 자동으로 생성
      if (!project) {
        const newProject = {
          _id: new ObjectId(projectId),
          userId: userCheck.user.userId || userCheck.user.email,
          email: userCheck.user.email,
          userObjectId: userCheck.user._id,
          title: '새 프로젝트',
          description: '',
          status: 'active',
          date: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        try {
          await projectsCollection.insertOne(newProject);
          project = newProject;
        } catch (error) {
          // 이미 존재하는 경우 다시 조회
          project = await projectsCollection.findOne({ _id: new ObjectId(projectId) });
          if (!project) {
            return res.status(500).json({ error: '프로젝트 생성에 실패했습니다.' });
          }
        }
      }

      // 업데이트할 데이터 준비
      const updateData = {
        updatedAt: new Date().toISOString()
      };

      if (label !== undefined) updateData.label = label.trim();
      if (status !== undefined) updateData.status = status;
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
      if (sshKey !== undefined) updateData.sshKey = sshKey || null;
      if (status || label || sshKey !== undefined) {
        updateData.time = new Date().toISOString();
      }

      // Task 업데이트
      const result = await tasksCollection.updateOne(
        { _id: new ObjectId(taskId), projectId: projectId },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Task를 찾을 수 없습니다.' });
      }

      // 업데이트된 Task 조회
      const updatedTask = await tasksCollection.findOne({ _id: new ObjectId(taskId) });

      return res.status(200).json({
        id: updatedTask._id.toString(),
        projectId: updatedTask.projectId,
        label: updatedTask.label,
        status: updatedTask.status,
        time: updatedTask.time,
        imageUrl: updatedTask.imageUrl,
        sshKey: updatedTask.sshKey,
        createdAt: updatedTask.createdAt,
        updatedAt: updatedTask.updatedAt
      });
    } catch (error) {
      console.error('RPA task update error:', error);
      return res.status(500).json({ error: 'Task 업데이트에 실패했습니다.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
