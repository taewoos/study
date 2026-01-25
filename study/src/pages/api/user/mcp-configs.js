import { connectDB } from '@/utils/db';
import { verifyUser } from '@/utils/authServer';

// MCP 설정 관리 API
export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = await connectDB();
  if (!client) {
    return res.status(500).json({ error: '데이터베이스 연결에 실패했습니다.' });
  }
  const db = client.db('study');
  const mcpConfigsCollection = db.collection('mcp_configs');

  try {
    // 사용자 인증 확인
    const userCheck = await verifyUser(req);
    if (!userCheck.authenticated) {
      return res.status(401).json({ error: userCheck.error || '인증이 필요합니다.' });
    }

    const userId = userCheck.user.userId || userCheck.user.email;

    if (req.method === 'POST') {
      // MCP 설정 저장
      const { mcpConfigs: mcpConfigsList } = req.body;

      if (!mcpConfigsList || !Array.isArray(mcpConfigsList)) {
        return res.status(400).json({ error: 'MCP 설정 목록이 필요합니다.' });
      }

      // 하나만 활성화되어 있는지 확인
      const activeCount = mcpConfigsList.filter(m => m.isActive).length;
      if (activeCount > 1) {
        return res.status(400).json({ error: '하나의 MCP만 활성화할 수 있습니다.' });
      }

      // MCP 설정 데이터 저장
      const mcpConfigData = {
        userId: userId,
        email: userCheck.user.email,
        mcpConfigs: mcpConfigsList.map(m => ({
          id: m.id,
          name: m.name,
          url: m.url,
          key: m.key,
          isActive: m.isActive
        })),
        updatedAt: new Date(),
      };

      // 기존 MCP 설정이 있으면 업데이트, 없으면 생성
      await mcpConfigsCollection.updateOne(
        { userId: userId },
        { 
          $set: mcpConfigData,
          $setOnInsert: { createdAt: new Date() }
        },
        { upsert: true }
      );

      return res.status(200).json({ 
        message: 'MCP 설정이 저장되었습니다.',
        success: true
      });
    }

    if (req.method === 'GET') {
      // MCP 설정 조회
      const mcpConfigsData = await mcpConfigsCollection.findOne({ userId: userId });

      if (!mcpConfigsData || !mcpConfigsData.mcpConfigs) {
        return res.status(200).json({
          mcpConfigs: []
        });
      }

      // 실제 값 반환 (사용자가 수정할 수 있도록)
      return res.status(200).json({
        mcpConfigs: mcpConfigsData.mcpConfigs.map(m => ({
          id: m.id,
          name: m.name,
          url: m.url || '',
          key: m.key || '', // 실제 키 값 반환
          isActive: m.isActive
        }))
      });
    }

    if (req.method === 'DELETE') {
      // MCP 설정 삭제
      const { configId } = req.body;

      if (configId) {
        // 특정 설정만 삭제
        await mcpConfigsCollection.updateOne(
          { userId: userId },
          { 
            $pull: { mcpConfigs: { id: configId } },
            $set: { updatedAt: new Date() }
          }
        );
      } else {
        // 전체 삭제
        await mcpConfigsCollection.deleteOne({ userId: userId });
      }

      return res.status(200).json({ message: 'MCP 설정이 삭제되었습니다.' });
    }
  } catch (error) {
    console.error('MCP configs error:', error);
    return res.status(500).json({ error: 'MCP 설정 처리 중 오류가 발생했습니다.' });
  }
}
