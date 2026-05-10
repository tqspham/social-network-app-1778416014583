import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { hashPassword, createSession } from '@/app/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, username } = body;

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'Email, password, and username are required' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);
    const userId = uuidv4();

    const { data, error } = await supabase
      .from('social_network_app_1778416014583_users')
      .insert([
        {
          user_id: userId,
          email,
          username,
          password_hash: passwordHash,
          bio: '',
          profile_picture: null,
        },
      ])
      .select('user_id, email');

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Registration failed' },
        { status: 400 }
      );
    }

    await createSession(userId);

    return NextResponse.json(
      { userId, email },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
