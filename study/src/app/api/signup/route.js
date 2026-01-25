import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, userId, password, company } = body;

    // 필수 필드 검증
    if (!name || !email || !userId || !password || !company) {
      return NextResponse.json(
        { error: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 비밀번호 길이 검증
    if (password.length < 6) {
      return NextResponse.json(
        { error: '비밀번호는 최소 6자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    const client = await connectDB;
    const db = client.db('study');
    const usersCollection = db.collection('users');

    // 중복 체크 (이메일 또는 아이디)
    const existingUser = await usersCollection.findOne({
      $or: [{ email }, { userId }]
    });

    if (existingUser) {
      return NextResponse.json(
        { error: '이미 존재하는 이메일 또는 아이디입니다.' },
        { status: 409 }
      );
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const newUser = {
      name,
      email,
      userId,
      password: hashedPassword,
      company,
      createdAt: new Date(),
      emailVerified: false
    };

    const result = await usersCollection.insertOne(newUser);

    return NextResponse.json(
      { 
        message: '회원가입이 완료되었습니다.',
        userId: result.insertedId 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: '회원가입 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
