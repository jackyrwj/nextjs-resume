import { createClient } from '@supabase/supabase-js';

// Allow both SUPABASE_URL and NEXT_PUBLIC_SUPABASE_URL for flexibility
const supabaseUrl = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

if (!supabaseUrl) {
  throw new Error('Missing Supabase URL. Please set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL in .env.local');
}

if (!/^https?:\/\//i.test(supabaseUrl)) {
  throw new Error(`Invalid Supabase URL: "${supabaseUrl}". It must start with http(s):// e.g. https://YOUR_REF.supabase.co`);
}

if (!serviceRoleKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY in .env.local');
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});


