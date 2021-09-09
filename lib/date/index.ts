export const afterDate = (milisecs?: number) => {
  //
  const ms = milisecs ? milisecs : /* 24h -> */ 1000 * 60 * 60 * 24;

  const currTime = new Date();

  const after = currTime.getTime() + ms;

  return new Date(after);
};

export const elapsed = (date: Date) => {
  const currTime = new Date().getTime();

  const time = date.getTime();

  return time < currTime;
};
