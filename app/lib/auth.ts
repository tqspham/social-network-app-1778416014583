import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';

const SESSION_COOKIE_NAME = 'session_id';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string): Promise<string> {
  const sessionId = `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
  });
  return sessionId;
}

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionId) return null;
  const userId = sessionId.split('_')[0];
  const { data, error } = await supabase
    .from('social_network_app_1778416014583_users')
    .select('user_id')
    .eq('user_id', userId)
    .single();
  return error ? null : userId;
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
