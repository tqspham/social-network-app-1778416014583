import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    const { data: posts, error } = await supabase
      .from('social_network_app_1778416014583_posts')
      .select('*')
      .eq('author_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      );
    }

    const postsWithAuthors = await Promise.all(
      (posts || []).map(async (post) => {
        const { data: author } = await supabase
          .from('social_network_app_1778416014583_users')
          .select('user_id, username, profile_picture')
          .eq('user_id', post.author_id)
          .single();

        const { count: likeCount } = await supabase
          .from('social_network_app_1778416014583_likes')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.post_id);

        return {
          postId: post.post_id,
          authorId: post.author_id,
          content: post.content,
          createdAt: post.created_at,
          likeCount: likeCount || 0,
          author: author || { user_id: post.author_id, username: 'Unknown', profile_picture: null },
        };
      })
    );

    return NextResponse.json({ posts: postsWithAuthors });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
