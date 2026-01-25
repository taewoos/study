// 로그아웃 API
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 서버 측에서는 세션을 무효화하거나 추가 처리를 할 수 있습니다.
    // 현재는 클라이언트 측에서 토큰을 제거하므로 여기서는 성공만 반환합니다.
    return res.status(200).json({ 
      message: '로그아웃되었습니다.' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ 
      error: '서버 오류가 발생했습니다.' 
    });
  }
}
