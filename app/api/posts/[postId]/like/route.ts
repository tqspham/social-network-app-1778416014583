import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSessionUserId } from '@/app/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { postId } = params;

    const { data: existingLike } = await supabase
      .from('social_network_app_1778416014583_likes')
      .select('like_id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      return NextResponse.json(
        { error: 'Already liked' },
        { status: 400 }
      );
    }

    const likeId = uuidv4();

    const { error: insertError } = await supabase
      .from('social_network_app_1778416014583_likes')
      .insert([
        {
          like_id: likeId,
          post_id: postId,
          user_id: userId,
        },
      ]);

    if (insertError) {
      return NextResponse.json(
        { error: 'Failed to like post' },
        { status: 500 }
      );
    }

    const { count: likeCount } = await supabase
      .from('social_network_app_1778416014583_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    return NextResponse.json({
      liked: true,
      likeCount: likeCount || 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { postId } = params;

    const { error: deleteError } = await supabase
      .from('social_network_app_1778416014583_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (deleteError) {
      return NextResponse.json(
        { error: 'Failed to unlike post' },
        { status: 500 }
      );
    }

    const { count: likeCount } = await supabase
      .from('social_network_app_1778416014583_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    return NextResponse.json({
      liked: false,
      likeCount: likeCount || 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
