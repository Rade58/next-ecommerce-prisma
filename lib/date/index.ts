export const after24Date = (milisecs?: number) => {
  //
  let ms = milisecs ? milisecs : /* 24h -> */ 1000 * 60 * 60 * 24;

  const currTime = new Date();

  const after = currTime.getTime() + ms;

  return new Date(after);
};
