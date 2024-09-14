import { createClient } from '@supabase/supabase-js';

const PROJECT_ID = 'wqyqougnnqwgqhjshpvz';
/**
 * This key is safe to be exposed in the client-side code and comitted to the repository
 * Ideally, we'd store it in .env as `PUBLIC_SUPABASE_ANON_KEY` to organize things better,
 * but this allows usage without having to set up environment variables.
 **/
const ANON_KEY =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxeXFvdWdubnF3Z3FoanNocHZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYyODY3NTYsImV4cCI6MjA0MTg2Mjc1Nn0.Y5KeqqATAK5ad_KGqFlRgN3cjjoXvKtShjS8pa3C2fQ';
export const supabase = createClient(`https://${PROJECT_ID}.supabase.co`, `${ANON_KEY}`);
