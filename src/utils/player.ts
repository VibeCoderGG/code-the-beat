export const generateRandomName = () => {
  const animals = ['Tiger', 'Falcon', 'Panther', 'Shark', 'Wolf', 'Fox', 'Eagle'];
  const adjectives = ['Swift', 'Silent', 'Fierce', 'Wild', 'Clever', 'Ghost', 'Rapid'];
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${animals[Math.floor(Math.random() * animals.length)]}${Math.floor(Math.random() * 1000)}`;
};

export const getOrCreatePlayerName = (): string => {
  const existing = localStorage.getItem('codeBeatPlayerName');
  if (existing) return existing;
  const newName = generateRandomName();
  localStorage.setItem('codeBeatPlayerName', newName);
  return newName;
};

export const updatePlayerNameOnce = (newName: string) => {
  const existing = localStorage.getItem('codeBeatPlayerName');
  if (existing && existing !== newName) {
    throw new Error(`You have already submitted your name: "${existing}". It cannot be changed again.`);
  }
  localStorage.setItem('codeBeatPlayerName', newName);
};
