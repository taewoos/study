import { connectDB } from '@/utils/db';
import { verifyUser } from '@/utils/authServer';

// RPA 프로젝트 조회 및 생성 API
export default async function handler(req, res) {
  const client = await connectDB();
  if (!client) {
    return res.status(500).json({ error: '데이터베이스 연결에 실패했습니다.' });
  }
  const db = client.db('study');
  const projectsCollection = db.collection('rpa_projects');

  if (req.method === 'GET') {
    try {
      // 사용자 인증 확인
      const userCheck = await verifyUser(req);
      if (!userCheck.authenticated) {
        return res.status(401).json({ error: userCheck.error || '인증이 필요합니다.' });
      }

      // 사용자의 프로젝트 조회
      const projects = await projectsCollection
        .find({
          $or: [
            { userId: userCheck.user.userId },
            { email: userCheck.user.email },
            { userObjectId: userCheck.user._id }
          ]
        })
        .sort({ createdAt: -1 })
        .toArray();

      // MongoDB ObjectId를 문자열로 변환
      const formattedProjects = projects.map(project => ({
        id: project._id.toString(),
        date: project.date || project.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
        title: project.title,
        description: project.description,
        status: project.status || 'active',
        createdAt: project.createdAt
      }));

      return res.status(200).json(formattedProjects);
    } catch (error) {
      console.error('RPA projects fetch error:', error);
      return res.status(500).json({ error: '프로젝트를 불러오는데 실패했습니다.' });
    }
  }

  if (req.method === 'POST') {
    try {
      // 사용자 인증 확인
      const userCheck = await verifyUser(req);
      if (!userCheck.authenticated) {
        return res.status(401).json({ error: userCheck.error || '인증이 필요합니다.' });
      }

      const { title, description } = req.body;

      // 필수 필드 검증
      if (!title || !description) {
        return res.status(400).json({ error: '제목과 설명을 입력해주세요.' });
      }

      // 새 프로젝트 생성
      const newProject = {
        userId: userCheck.user.userId || userCheck.user.email,
        email: userCheck.user.email,
        userObjectId: userCheck.user._id, // 사용자 ObjectId를 별도 필드로 저장
        title: title.trim(),
        description: description.trim(),
        status: 'active',
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const result = await projectsCollection.insertOne(newProject);

      // 생성된 프로젝트 반환
      const createdProject = {
        id: result.insertedId.toString(),
        date: newProject.date,
        title: newProject.title,
        description: newProject.description,
        status: newProject.status,
        createdAt: newProject.createdAt
      };

      return res.status(201).json(createdProject);
    } catch (error) {
      console.error('RPA project create error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        body: req.body
      });
      return res.status(500).json({ 
        error: '프로젝트 생성에 실패했습니다.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
