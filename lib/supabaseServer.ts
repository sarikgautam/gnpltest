import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Prefer service role key, fallback to anon key for local development
export const supabase = createClient(url, serviceRoleKey || anonKey, {
  auth: { persistSession: false },
});
