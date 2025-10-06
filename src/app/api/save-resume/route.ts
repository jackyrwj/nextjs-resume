import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';

// Expected table schema in Supabase:
// create table resumes (
//   id uuid primary key default gen_random_uuid(),
//   created_at timestamptz default now(),
//   data jsonb not null
// );

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { error } = await supabaseAdmin
      .from('resumes')
      .insert({ data: body });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}


