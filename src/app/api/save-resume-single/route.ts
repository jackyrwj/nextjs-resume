import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';

type Payload = {
  userId: string; // expect a UUID of the user (auth.uid())
  personalInfo: {
    name: string;
    title?: string;
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    github?: string;
    linkedin?: string;
  };
  experience: Array<{
    company: string;
    position: string;
    period?: string;
    description?: string[];
  }>;
  education: Array<{
    school: string;
    degree?: string;
    period?: string;
    gpa?: string;
  }>;
  projects: Array<{
    name: string;
    tech?: string;
    period?: string;
    description?: string;
  }>;
  skills: {
    frontend?: string[];
    tools?: string[];
    backend?: string[];
    other?: string[];
  };
};

function joinOrUndefined(values?: string[]) {
  return Array.isArray(values) && values.length > 0 ? values.join(', ') : undefined;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Payload;
    const { userId, personalInfo, experience, education, projects, skills } = body;

    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    if (!personalInfo?.name) return NextResponse.json({ error: 'personalInfo.name is required' }, { status: 400 });

    // Flatten first items for demo; extend as needed
    const exp1 = experience?.[0];
    const edu1 = education?.[0];
    const proj1 = projects?.[0];

    const payload = {
      user_id: userId,
      name: personalInfo.name,
      title: personalInfo.title ?? null,
      email: personalInfo.email ?? null,
      phone: personalInfo.phone ?? null,
      location: personalInfo.location ?? null,
      website: personalInfo.website ?? null,
      github: personalInfo.github ?? null,
      linkedin: personalInfo.linkedin ?? null,

      exp1_company: exp1?.company ?? null,
      exp1_position: exp1?.position ?? null,
      exp1_period: exp1?.period ?? null,
      exp1_desc: (exp1?.description || []).join('\n') || null,

      edu1_school: edu1?.school ?? null,
      edu1_degree: edu1?.degree ?? null,
      edu1_period: edu1?.period ?? null,
      edu1_gpa: edu1?.gpa ?? null,

      proj1_name: proj1?.name ?? null,
      proj1_tech: proj1?.tech ?? null,
      proj1_period: proj1?.period ?? null,
      proj1_desc: proj1?.description ?? null,

      skills_frontend: joinOrUndefined(skills?.frontend) ?? null,
      skills_tools: joinOrUndefined(skills?.tools) ?? null,
      skills_backend: joinOrUndefined(skills?.backend) ?? null,
      skills_other: joinOrUndefined(skills?.other) ?? null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabaseAdmin
      .from('user_resume')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}


