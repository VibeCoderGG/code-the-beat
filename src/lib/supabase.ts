import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface LeaderboardEntry {
  id?: number;
  player_name: string;
  score: number;
  level_reached: number;
  challenges_completed: number;
  created_at?: string;
}
// 🔍 Filter leaderboard by level
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

// 🌍 Get global leaderboard (top N scores)
export const getLeaderboard = async (limit = 20) => {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('score', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
};
// Check if a player name already exists in DB
export const playerExists = async (playerName: string) => {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('player_name')
    .eq('player_name', playerName)
    .single();

  return data !== null && !error;
};

// Submit or update score based on local stored name
export const submitScore = async (entry: Omit<LeaderboardEntry, 'id' | 'created_at'>) => {
  const { data: existing, error: fetchError } = await supabase
    .from('leaderboard')
    .select('*')
    .eq('player_name', entry.player_name)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

  if (existing) {
    const { error: updateError } = await supabase
      .from('leaderboard')
      .update({
        score: entry.score,
        level_reached: entry.level_reached,
        challenges_completed: entry.challenges_completed
      })
      .eq('player_name', entry.player_name);
    if (updateError) throw updateError;
    return { updated: true };
  } else {
    const { error: insertError } = await supabase
      .from('leaderboard')
      .insert([entry])
      .select();
    if (insertError) throw insertError;
    return { inserted: true };
  }
};
