import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create Supabase client if both URL and key are provided
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Flag to check if Supabase is available
export const isSupabaseAvailable = !!supabase;

export interface LeaderboardEntry {
  id?: number;
  player_name: string;
  score: number;
  level_reached: number;
  challenges_completed: number;
  created_at?: string;
}
// 🔍 Filter leaderboard by level
export const getLeaderboardByLevel = async (level: number, limit = 5): Promise<LeaderboardEntry[]> => {
  if (!supabase) {
    // Return empty array if Supabase is not available
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('level_reached', level)
      .order('score', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('Supabase error:', error);
    return [];
  }
};

// 🌍 Get global leaderboard (top N scores)
export const getLeaderboard = async (limit = 20): Promise<LeaderboardEntry[]> => {
  if (!supabase) {
    // Return empty array if Supabase is not available
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('Supabase error:', error);
    return [];
  }
};

// Check if a player name already exists in DB
export const playerExists = async (playerName: string): Promise<boolean> => {
  if (!supabase) {
    // Return false if Supabase is not available
    return false;
  }
  
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('player_name')
      .eq('player_name', playerName)
      .single();

    return data !== null && !error;
  } catch (error) {
    console.warn('Supabase error:', error);
    return false;
  }
};

// Submit or update score based on local stored name
export const submitScore = async (entry: Omit<LeaderboardEntry, 'id' | 'created_at'>): Promise<{ updated?: boolean; inserted?: boolean }> => {
  if (!supabase) {
    // Return success response if Supabase is not available
    console.warn('Supabase not available, score not submitted');
    return { inserted: true };
  }
  
  try {
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
  } catch (error) {
    console.warn('Supabase error:', error);
    return { inserted: true };
  }
};
