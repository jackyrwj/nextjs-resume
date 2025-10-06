import { NextResponse } from 'next/server';

export async function GET() {
  const candidates = {
    SUPABASE_URL: (process.env.SUPABASE_URL || '').trim(),
    NEXT_PUBLIC_SUPABASE_URL: (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim(),
    SUPABASE_SERVICE_ROLE_KEY: (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim(),
  };

  const mask = (value: string) => (value ? `${value.slice(0, 8)}… (${value.length} chars)` : '');

  return NextResponse.json({
    detected: {
      SUPABASE_URL: Boolean(candidates.SUPABASE_URL),
      NEXT_PUBLIC_SUPABASE_URL: Boolean(candidates.NEXT_PUBLIC_SUPABASE_URL),
      SUPABASE_SERVICE_ROLE_KEY: Boolean(candidates.SUPABASE_SERVICE_ROLE_KEY),
    },
    preview: {
      SUPABASE_URL: mask(candidates.SUPABASE_URL),
      NEXT_PUBLIC_SUPABASE_URL: mask(candidates.NEXT_PUBLIC_SUPABASE_URL),
      SUPABASE_SERVICE_ROLE_KEY: mask(candidates.SUPABASE_SERVICE_ROLE_KEY),
    },
    note: 'Values are masked. Ensure at least SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY are present.',
  });
}


