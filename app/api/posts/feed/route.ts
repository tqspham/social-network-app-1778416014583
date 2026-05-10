import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSessionUserId } from '@/app/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: connections, error: connError } = await supabase
      .from('social_network_app_1778416014583_connections')
      .select('user_id_1, user_id_2')
      .eq('status', 'accepted')
      .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`);

    if (connError) {
      return NextResponse.json(
        { error: 'Failed to fetch connections' },
        { status: 500 }
      );
    }

    const connectedUserIds = new Set<string>();
    connections?.forEach((conn) => {
      if (conn.user_id_1 === userId) {
        connectedUserIds.add(conn.user_id_2);
      } else {
        connectedUserIds.add(conn.user_id_1);
      }
    });

    const userIdArray = Array.from(connectedUserIds);
    userIdArray.push(userId);

    const { data: posts, error: postsError } = await supabase
      .from('social_network_app_1778416014583_posts')
      .select('*')
      .in('author_id', userIdArray)
      .order('created_at', { ascending: false });

    if (postsError) {
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
