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
    const { targetUserId } = body;

    if (!targetUserId || targetUserId === userId) {
      return NextResponse.json(
        { error: 'Invalid target user' },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from('social_network_app_1778416014583_connections')
      .select('connection_id')
      .or(
        `and(user_id_1.eq.${userId},user_id_2.eq.${targetUserId}),and(user_id_1.eq.${targetUserId},user_id_2.eq.${userId})`
      )
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Connection already exists' },
        { status: 400 }
      );
    }

    const requestId = uuidv4();

    const { data, error } = await supabase
      .from('social_network_app_1778416014583_connections')
      .insert([
        {
          connection_id: requestId,
          user_id_1: userId,
          user_id_2: targetUserId,
          status: 'pending',
        },
      ])
      .select('connection_id, status');

    if (error) {
      return NextResponse.json(
        { error: 'Failed to send connection request' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { requestId, status: 'pending' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
