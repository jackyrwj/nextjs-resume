import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';

type ResumePayload = {
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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ResumePayload;

    const { personalInfo, experience, education, projects, skills } = body;

    if (!personalInfo?.name) {
      return NextResponse.json({ error: 'personalInfo.name is required' }, { status: 400 });
    }

    // 1) insert resume header
    const { data: resumeRows, error: resumeErr } = await supabaseAdmin
      .from('resumes_detailed')
      .insert({
        name: personalInfo.name,
        title: personalInfo.title ?? null,
        email: personalInfo.email ?? null,
        phone: personalInfo.phone ?? null,
        location: personalInfo.location ?? null,
        website: personalInfo.website ?? null,
        github: personalInfo.github ?? null,
        linkedin: personalInfo.linkedin ?? null,
      })
      .select('id')
      .single();

    if (resumeErr || !resumeRows) {
      return NextResponse.json({ error: resumeErr?.message || 'Failed to insert resume' }, { status: 500 });
    }

    const resumeId = resumeRows.id as string;

    // 2) experiences
    if (Array.isArray(experience) && experience.length > 0) {
      const expRecords = experience.map((exp, idx) => ({
        resume_id: resumeId,
        company: exp.company,
        position: exp.position,
        period: exp.period ?? null,
        order_index: idx,
      }));

      const { data: insertedExps, error: expErr } = await supabaseAdmin
        .from('experiences')
        .insert(expRecords)
        .select('id');
      if (expErr) {
        return NextResponse.json({ error: expErr.message }, { status: 500 });
      }

      // bullets
      const bullets: Array<{ experience_id: string; content: string; order_index: number }> = [];
      insertedExps?.forEach((row, i) => {
        const descs = experience[i]?.description || [];
        descs.forEach((text, j) => {
          bullets.push({ experience_id: row.id, content: text, order_index: j });
        });
      });
      if (bullets.length > 0) {
        const { error: bulletErr } = await supabaseAdmin.from('experience_bullets').insert(bullets);
        if (bulletErr) {
          return NextResponse.json({ error: bulletErr.message }, { status: 500 });
        }
      }
    }

    // 3) educations
    if (Array.isArray(education) && education.length > 0) {
      const eduRecords = education.map((edu, idx) => ({
        resume_id: resumeId,
        school: edu.school,
        degree: edu.degree ?? null,
        period: edu.period ?? null,
        gpa: edu.gpa ?? null,
        order_index: idx,
      }));
      const { error: eduErr } = await supabaseAdmin.from('educations').insert(eduRecords);
      if (eduErr) {
        return NextResponse.json({ error: eduErr.message }, { status: 500 });
      }
    }

    // 4) projects
    if (Array.isArray(projects) && projects.length > 0) {
      const projRecords = projects.map((p, idx) => ({
        resume_id: resumeId,
        name: p.name,
        tech: p.tech ?? null,
        period: p.period ?? null,
        description: p.description ?? null,
        order_index: idx,
      }));
      const { error: projErr } = await supabaseAdmin.from('projects').insert(projRecords);
      if (projErr) {
        return NextResponse.json({ error: projErr.message }, { status: 500 });
      }
    }

    // 5) skills (flatten by categories)
    const skillRecords: Array<{ resume_id: string; category: string; name: string; order_index: number }> = [];
    if (skills) {
      (['frontend', 'tools', 'backend', 'other'] as const).forEach((cat) => {
        const list = (skills as any)[cat] as string[] | undefined;
        if (Array.isArray(list)) {
          list.forEach((name, idx) => {
            skillRecords.push({ resume_id: resumeId, category: cat, name, order_index: idx });
          });
        }
      });
    }
    if (skillRecords.length > 0) {
      const { error: skillErr } = await supabaseAdmin.from('skills').insert(skillRecords);
      if (skillErr) {
        return NextResponse.json({ error: skillErr.message }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true, resumeId });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}


