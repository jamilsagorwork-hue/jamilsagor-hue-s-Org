
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mspgjebbngkimyhrvlrd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_7gtnXGT_YXju-LRXzOJulg_fgBQKFRa';

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
