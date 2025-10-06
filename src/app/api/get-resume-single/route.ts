import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('user_resume')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ data: null });

  // Map columns back to UI structure
  const resp = {
    personalInfo: {
      name: data.name,
      title: data.title,
      email: data.email,
      phone: data.phone,
      location: data.location,
      website: data.website,
      github: data.github,
      linkedin: data.linkedin,
    },
    experience: [
      {
        company: data.exp1_company || '',
        position: data.exp1_position || '',
        period: data.exp1_period || '',
        description: (data.exp1_desc ? String(data.exp1_desc).split('\n').filter(Boolean) : []),
      },
    ].filter(e => e.company || e.position || e.period || (e.description?.length ?? 0) > 0),
    education: [
      {
        school: data.edu1_school || '',
        degree: data.edu1_degree || '',
        period: data.edu1_period || '',
        gpa: data.edu1_gpa || '',
      },
    ].filter(e => e.school || e.degree || e.period || e.gpa),
    projects: [
      {
        name: data.proj1_name || '',
        tech: data.proj1_tech || '',
        period: data.proj1_period || '',
        description: data.proj1_desc || '',
      },
    ].filter(p => p.name || p.tech || p.period || p.description),
    skills: {
      frontend: data.skills_frontend ? String(data.skills_frontend).split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      tools: data.skills_tools ? String(data.skills_tools).split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      backend: data.skills_backend ? String(data.skills_backend).split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      other: data.skills_other ? String(data.skills_other).split(',').map((s: string) => s.trim()).filter(Boolean) : [],
    }
  };

  return NextResponse.json({ data: resp });
}


