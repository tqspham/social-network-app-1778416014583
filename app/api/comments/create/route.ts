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
    const { postId, content } = body;

    if (!postId || !content || content.trim() === '') {
      return NextResponse.json(
        { error: 'Post ID and content are required' },
        { status: 400 }
      );
    }

    const commentId = uuidv4();
    const createdAt = new Date().toISOString();

    const { data, error } = await supabase
      .from('social_network_app_1778416014583_comments')
      .insert([
        {
          comment_id: commentId,
          post_id: postId,
          author_id: userId,
          content,
          created_at: createdAt,
        },
      ])
      .select('comment_id, content, created_at, author_id');

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create comment' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { commentId, content, createdAt, authorId: userId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
