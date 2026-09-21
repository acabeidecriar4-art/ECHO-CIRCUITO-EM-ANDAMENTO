import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.112.2?bundle';

const runtimeConfig = globalThis.__ECHO_ARENA_PUBLIC_CONFIG__;
const SUPABASE_URL = runtimeConfig?.SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = runtimeConfig?.SUPABASE_PUBLISHABLE_KEY;

if (SUPABASE_URL !== 'https://nqklhsfaqpbjqmfzjzxk.supabase.co' || !/^sb_publishable_[A-Za-z0-9_-]{20,}$/.test(SUPABASE_PUBLISHABLE_KEY || '')) {
  throw new Error('[supabase] configuração pública de runtime ausente ou inválida.');
}

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'echo-arena-auth'
    }
  }
);