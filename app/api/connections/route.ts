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
      .select('*')
      .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`);

    if (connError) {
      return NextResponse.json(
        { error: 'Failed to fetch connections' },
        { status: 500 }
      );
    }

    const acceptedConnections = connections
      ?.filter((c) => c.status === 'accepted')
      .map((c) => (c.user_id_1 === userId ? c.user_id_2 : c.user_id_1)) || [];

    const pendingRequests = connections
      ?.filter((c) => c.status === 'pending' && c.user_id_2 === userId) || [];

    const acceptedUsers = await Promise.all(
      acceptedConnections.map(async (connUserId) => {
        const { data: user } = await supabase
          .from('social_network_app_1778416014583_users')
          .select('user_id, username, bio, profile_picture')
          .eq('user_id', connUserId)
          .single();
        return user || { user_id: connUserId, username: 'Unknown', bio: '', profile_picture: null };
      })
    );

    const pendingWithUsers = await Promise.all(
      pendingRequests.map(async (req) => {
        const { data: user } = await supabase
          .from('social_network_app_1778416014583_users')
          .select('user_id, username, profile_picture')
          .eq('user_id', req.user_id_1)
          .single();
        return {
          requestId: req.connection_id,
          status: req.status,
          user: user || { user_id: req.user_id_1, username: 'Unknown', profile_picture: null },
        };
      })
    );

    return NextResponse.json({
      accepted: acceptedUsers,
      pending: pendingWithUsers,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
