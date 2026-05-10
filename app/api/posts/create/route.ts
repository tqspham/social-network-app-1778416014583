import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSessionUserId } from '@/app/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content } = body;

    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const postId = uuidv4();
    const createdAt = new Date().toISOString();

    const { data, error } = await supabase
      .from('social_network_app_1778416014583_posts')
      .insert([
        {
          post_id: postId,
          author_id: userId,
          content,
          created_at: createdAt,
        },
      ])
      .select('post_id, content, created_at, author_id');

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create post' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { postId, content, createdAt, authorId: userId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
