import { connectDB } from '@/utils/db';
import { verifyUser } from '@/utils/authServer';

// API 키 관리 API
export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = await connectDB();
  if (!client) {
    return res.status(500).json({ error: '데이터베이스 연결에 실패했습니다.' });
  }
  const db = client.db('study');
  const apiKeysCollection = db.collection('api_keys');

  try {
    // 사용자 인증 확인
    const userCheck = await verifyUser(req);
    if (!userCheck.authenticated) {
      return res.status(401).json({ error: userCheck.error || '인증이 필요합니다.' });
    }

    const userId = userCheck.user.userId || userCheck.user.email;

    if (req.method === 'POST') {
      // API 키 저장
      const { apiKeys: apiKeysList } = req.body;

      if (!apiKeysList || !Array.isArray(apiKeysList)) {
        return res.status(400).json({ error: 'API 키 목록이 필요합니다.' });
      }

      // 하나만 활성화되어 있는지 확인
      const activeCount = apiKeysList.filter(k => k.isActive).length;
      if (activeCount > 1) {
        return res.status(400).json({ error: '하나의 API 키만 활성화할 수 있습니다.' });
      }

      // API 키 데이터 저장
      const apiKeyData = {
        userId: userId,
        email: userCheck.user.email,
        apiKeys: apiKeysList.map(k => ({
          id: k.id,
          name: k.name,
          key: k.key,
          isActive: k.isActive
        })),
        updatedAt: new Date(),
      };

      // 기존 API 키가 있으면 업데이트, 없으면 생성
      await apiKeysCollection.updateOne(
        { userId: userId },
        { 
          $set: apiKeyData,
          $setOnInsert: { createdAt: new Date() }
        },
        { upsert: true }
      );

      return res.status(200).json({ 
        message: 'API 키가 저장되었습니다.',
        success: true
      });
    }

    if (req.method === 'GET') {
      // API 키 조회
      const apiKeysData = await apiKeysCollection.findOne({ userId: userId });

      if (!apiKeysData || !apiKeysData.apiKeys) {
        return res.status(200).json({
          apiKeys: []
        });
      }

      // 실제 키 값 반환 (사용자가 수정할 수 있도록)
      return res.status(200).json({
        apiKeys: apiKeysData.apiKeys.map(k => ({
          id: k.id,
          name: k.name,
          key: k.key || '', // 실제 키 값 반환
          isActive: k.isActive
        }))
      });
    }

    if (req.method === 'DELETE') {
      // API 키 삭제
      const { keyType } = req.body; // 'gpt' or 'gemini' or 'all'

      if (keyType === 'all') {
        await apiKeysCollection.deleteOne({ userId: userId });
      } else if (keyType === 'gpt') {
        await apiKeysCollection.updateOne(
          { userId: userId },
          { $set: { gptApiKey: null, updatedAt: new Date() } }
        );
      } else if (keyType === 'gemini') {
        await apiKeysCollection.updateOne(
          { userId: userId },
          { $set: { geminiApiKey: null, updatedAt: new Date() } }
        );
      }

      return res.status(200).json({ message: 'API 키가 삭제되었습니다.' });
    }
  } catch (error) {
    console.error('API keys error:', error);
    return res.status(500).json({ error: 'API 키 처리 중 오류가 발생했습니다.' });
  }
}

// API 키 마스킹 함수 (보안)
function maskApiKey(key) {
  if (!key || key.length < 8) return '****';
  return key.substring(0, 4) + '...' + key.substring(key.length - 4);
}
