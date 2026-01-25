// 로그아웃 API
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // JWT 토큰 기반에서는 서버 측에서 토큰을 무효화할 수 있지만,
    // 현재는 stateless 방식이므로 클라이언트에서 토큰을 제거하면 됩니다.
    // 필요시 토큰 블랙리스트를 구현할 수 있습니다.
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
