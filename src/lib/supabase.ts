import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface LeaderboardEntry {
  id?: number;
  player_name: string;
  score: number;
  level_reached: number;
  challenges_completed: number;
  created_at?: string;
}

export const submitScore = async (entry: Omit<LeaderboardEntry, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('leaderboard')
    .insert([entry])
    .select();
  
  if (error) throw error;
  return data;
};

export const getLeaderboard = async (limit = 10) => {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('score', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
};

export const getLeaderboardByLevel = async (level: number, limit = 5) => {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .eq('level_reached', level)
    .order('score', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
};