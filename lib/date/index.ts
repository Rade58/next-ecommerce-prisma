export const afterDate = (minutes: number) => {
  const currTime = new Date();

  currTime.setMinutes(currTime.getMinutes() + minutes);

  return currTime;
};

export const elapsed = (date: Date) => {
  const time = date.getTime();

  const currTime = new Date().getTime();

  return time < currTime;
};
