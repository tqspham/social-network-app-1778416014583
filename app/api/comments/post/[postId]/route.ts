import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;

    const { data: comments, error } = await supabase
      .from('social_network_app_1778416014583_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch comments' },
        { status: 500 }
      );
    }

    const commentsWithAuthors = await Promise.all(
      (comments || []).map(async (comment) => {
        const { data: author } = await supabase
          .from('social_network_app_1778416014583_users')
          .select('user_id, username, profile_picture')
          .eq('user_id', comment.author_id)
          .single();

        return {
          commentId: comment.comment_id,
          postId: comment.post_id,
          authorId: comment.author_id,
          content: comment.content,
          createdAt: comment.created_at,
          author: author || { user_id: comment.author_id, username: 'Unknown', profile_picture: null },
        };
      })
    );

    return NextResponse.json({ comments: commentsWithAuthors });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
