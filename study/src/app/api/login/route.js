import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, password } = body;

    // 필수 필드 검증
    if (!userId || !password) {
      return NextResponse.json(
        { error: '아이디와 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    const client = await connectDB;
    const db = client.db('study');
    const usersCollection = db.collection('users');

    // 사용자 찾기 (아이디 또는 이메일로 검색)
    const user = await usersCollection.findOne({
      $or: [{ userId }, { email: userId }]
    });

    if (!user) {
      return NextResponse.json(
        { error: '아이디 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '아이디 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 로그인 성공 - 사용자 정보 반환 (비밀번호 제외)
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { 
        message: '로그인 성공',
        user: userWithoutPassword
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: '로그인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
