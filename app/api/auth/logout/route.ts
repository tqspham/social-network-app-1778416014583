import { NextRequest, NextResponse } from 'next/server';
import { clearSession } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await clearSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
