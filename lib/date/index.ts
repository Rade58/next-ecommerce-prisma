export const afterDate = (milisecs?: number) => {
  //
  const ms = milisecs ? milisecs : /* 24h -> */ 1000 * 60 * 60 * 24;

  const currTime = new Date();

  currTime.setMilliseconds(currTime.getMilliseconds() + ms);

  return currTime;
};

export const elapsed = (date: Date) => {
  const currTime = new Date().getTime();

  const time = date.getTime();

  console.log("time < currTime");
  console.log(time < currTime);

  return time < currTime;
};
