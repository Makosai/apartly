import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY as ANON_KEY } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(PUBLIC_SUPABASE_URL, ANON_KEY);
