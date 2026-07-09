import { createClient } from '@supabase/supabase-js';

// Uy24/7 — supabase loyihasi (uy247.uz)
const supabaseUrl = 'https://tbwjeyovxynbumricljh.supabase.co';
const supabaseAnonKey = 'sb_publishable_a43G6Q2oVDhr8iVZpwWTpQ_sJRPJ_9o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
