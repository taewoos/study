// 사용자 인증 및 권한 확인 유틸리티

// JWT 토큰 가져오기
export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// JWT 토큰 형식 확인 (header.payload.signature 형식)
const isJWTToken = (token) => {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  return parts.length === 3; // JWT는 3부분으로 구성됨
};

// 사용자 정보 가져오기 (JWT 토큰에서 디코딩하거나 저장된 사용자 정보 사용)
export const getUser = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    // 먼저 저장된 사용자 정보 확인 (가장 안정적)
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // 사용자 정보가 유효한지 확인
        if (user && (user.userId || user.email)) {
          return user;
        }
      } catch (error) {
        // JSON 파싱 실패 시 무시
      }
    }
    
    // JWT 토큰이 있으면 디코딩 시도
    const token = getToken();
    if (token) {
      // JWT 형식인지 확인
      if (!isJWTToken(token)) {
        // JWT 형식이 아니면 기존 JSON 형식일 수 있음 (마이그레이션 중)
        try {
          return JSON.parse(token);
        } catch (error) {
          // JSON도 아니면 null 반환
          return null;
        }
      }
      
      try {
        // JWT 토큰을 디코딩
        const parts = token.split('.');
        if (parts.length !== 3) {
          return null;
        }
        
        const base64Url = parts[1];
        if (!base64Url) {
          return null;
        }
        
        // URL-safe Base64를 표준 Base64로 변환
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        
        // Base64 디코딩
        const decoded = atob(base64);
        
        // URI 디코딩
        const jsonPayload = decodeURIComponent(
          decoded.split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join('')
        );
        
        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error('Error decoding JWT token:', error);
        // 디코딩 실패 시 저장된 사용자 정보 반환 시도
        if (userStr) {
          try {
            return JSON.parse(userStr);
          } catch (e) {
            return null;
          }
        }
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
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
