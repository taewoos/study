// 사용자 인증 및 권한 확인 유틸리티

export const getUser = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return null;
    
    return JSON.parse(token);
  } catch (error) {
    console.error('Error parsing user token:', error);
    return null;
  }
};

export const isAdmin = () => {
  const user = getUser();
  return user?.role === 0;
};

export const getUserRole = () => {
  const user = getUser();
  return user?.role ?? null;
};
