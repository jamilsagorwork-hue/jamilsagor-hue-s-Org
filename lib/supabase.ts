
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hlzwvrgtbiybafiugnsv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_X7zJ2hU0UK7mWLbpoRQDzg_HY_r3s4Z';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Local storage fallback will be used.');
}

// Ensure values are provided to createClient or default to dummy values that don't throw immediately
// but createClient will throw if URL is invalid. We use the provided values as fallback.
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

export enum TableNames {
  MESSAGES = 'messages',
  CAPABILITIES = 'capabilities',
  SETTINGS = 'settings'
}
