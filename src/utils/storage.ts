export const saveLocalPlayer = (player_name: string, score: number, level_reached: number, challenges_completed: number) => {
  localStorage.setItem("codeBeatPlayer", JSON.stringify({ player_name, score, level_reached, challenges_completed }));
};

export const getLocalPlayer = (): {
  player_name: string;
  score: number;
  level_reached: number;
  challenges_completed: number;
} | null => {
  const raw = localStorage.getItem("codeBeatPlayer");
  return raw ? JSON.parse(raw) : null;
};
