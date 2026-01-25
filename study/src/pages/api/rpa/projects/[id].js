import { connectDB } from '@/utils/db';
import { verifyUser } from '@/utils/authServer';
import { ObjectId } from 'mongodb';

// RPA 프로젝트 상세 조회 및 삭제 API
export default async function handler(req, res) {
  const client = await connectDB();
  if (!client) {
    return res.status(500).json({ error: '데이터베이스 연결에 실패했습니다.' });
  }
  const db = client.db('study');
  const projectsCollection = db.collection('rpa_projects');
  const tasksCollection = db.collection('rpa_tasks');

  if (req.method === 'GET') {
    try {
      // 사용자 인증 확인
      const userCheck = await verifyUser(req);
      if (!userCheck.authenticated) {
        return res.status(401).json({ error: userCheck.error || '인증이 필요합니다.' });
      }

      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: '프로젝트 ID가 필요합니다.' });
      }

      // ObjectId 유효성 검사
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: '유효하지 않은 프로젝트 ID입니다.' });
      }

      // 프로젝트 조회
      const project = await projectsCollection.findOne({
        _id: new ObjectId(id),
        $or: [
          { userId: userCheck.user.userId },
          { email: userCheck.user.email },
          { userObjectId: userCheck.user._id }
        ]
      });

      if (!project) {
        return res.status(404).json({ error: '프로젝트를 찾을 수 없습니다.' });
      }

      // 해당 프로젝트의 tasks 조회
      const tasks = await tasksCollection
        .find({ projectId: id })
        .sort({ createdAt: -1 })
        .toArray();

      // 프로젝트 정보와 tasks 반환
      const formattedProject = {
        id: project._id.toString(),
        title: project.title,
        description: project.description,
        date: project.date || project.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
        status: project.status || 'active',
        createdAt: project.createdAt,
        tasks: tasks.map(task => ({
          id: task._id.toString(),
          label: task.label,
          status: task.status || 'ready',
          time: task.time || task.updatedAt || task.createdAt,
          imageUrl: task.imageUrl || null,
          sshKey: task.sshKey || null,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt
        })),
        logs: project.logs || []
      };

      return res.status(200).json(formattedProject);
    } catch (error) {
      console.error('RPA project fetch error:', error);
      return res.status(500).json({ error: '프로젝트를 불러오는데 실패했습니다.' });
    }
  }

  if (req.method === 'PUT') {
    try {
      // 사용자 인증 확인
      const userCheck = await verifyUser(req);
      if (!userCheck.authenticated) {
        return res.status(401).json({ error: userCheck.error || '인증이 필요합니다.' });
      }

      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: '프로젝트 ID가 필요합니다.' });
      }

      // ObjectId 유효성 검사
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: '유효하지 않은 프로젝트 ID입니다.' });
      }

      const { title, description } = req.body;

      // 프로젝트 소유권 확인 또는 생성
      let project = await projectsCollection.findOne({
        _id: new ObjectId(id),
        $or: [
          { userId: userCheck.user.userId },
          { email: userCheck.user.email },
          { userObjectId: userCheck.user._id }
        ]
      });

      // 프로젝트가 없으면 자동으로 생성
      if (!project) {
        const newProject = {
          _id: new ObjectId(id),
          userId: userCheck.user.userId || userCheck.user.email,
          email: userCheck.user.email,
          userObjectId: userCheck.user._id,
          title: title?.trim() || '새 프로젝트',
          description: description?.trim() || '',
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
          project = await projectsCollection.findOne({ _id: new ObjectId(id) });
          if (!project) {
            return res.status(500).json({ error: '프로젝트 생성에 실패했습니다.' });
          }
        }
      }

      // 업데이트할 데이터 준비
      const updateData = {
        updatedAt: new Date().toISOString()
      };

      if (title !== undefined) updateData.title = title.trim();
      if (description !== undefined) updateData.description = description.trim();

      // 프로젝트 업데이트
      const result = await projectsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: '프로젝트를 찾을 수 없습니다.' });
      }

      // 업데이트된 프로젝트 조회
      const updatedProject = await projectsCollection.findOne({ _id: new ObjectId(id) });
      const tasks = await tasksCollection
        .find({ projectId: id })
        .sort({ createdAt: -1 })
        .toArray();

      return res.status(200).json({
        id: updatedProject._id.toString(),
        title: updatedProject.title,
        description: updatedProject.description,
        date: updatedProject.date || updatedProject.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
        status: updatedProject.status || 'active',
        createdAt: updatedProject.createdAt,
        tasks: tasks.map(task => ({
          id: task._id.toString(),
          label: task.label,
          status: task.status || 'ready',
          time: task.time || task.updatedAt || task.createdAt,
          imageUrl: task.imageUrl || null,
          sshKey: task.sshKey || null,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt
        })),
        logs: updatedProject.logs || []
      });
    } catch (error) {
      console.error('RPA project update error:', error);
      return res.status(500).json({ error: '프로젝트 수정에 실패했습니다.' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      // 사용자 인증 확인
      const userCheck = await verifyUser(req);
      if (!userCheck.authenticated) {
        return res.status(401).json({ error: userCheck.error || '인증이 필요합니다.' });
      }

      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: '프로젝트 ID가 필요합니다.' });
      }

      // ObjectId 유효성 검사
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: '유효하지 않은 프로젝트 ID입니다.' });
      }

      // 프로젝트 소유권 확인
      const project = await projectsCollection.findOne({
        _id: new ObjectId(id),
        $or: [
          { userId: userCheck.user.userId },
          { email: userCheck.user.email },
          { userObjectId: userCheck.user._id }
        ]
      });

      if (!project) {
        return res.status(404).json({ error: '프로젝트를 찾을 수 없거나 삭제 권한이 없습니다.' });
      }

      // 프로젝트와 관련된 모든 tasks 삭제
      await tasksCollection.deleteMany({ projectId: id });

      // 프로젝트 삭제
      await projectsCollection.deleteOne({ _id: new ObjectId(id) });

      return res.status(200).json({ message: '프로젝트가 삭제되었습니다.' });
    } catch (error) {
      console.error('RPA project delete error:', error);
      return res.status(500).json({ error: '프로젝트 삭제에 실패했습니다.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
