import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getVideoById(id: string) {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .single();

  if (error) {
    console.error('Error fetching video:', error);
    return null;
  }

  return data;
}