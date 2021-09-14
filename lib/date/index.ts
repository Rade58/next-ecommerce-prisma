export const afterDate = (minutes: number) => {
  const currTime = new Date();

  currTime.setMinutes(currTime.getMinutes() + minutes);

  return currTime;
};

export const elapsed = (date: Date) => {
  const time = date.getMinutes();

  const currTime = new Date(Date.now()).getMinutes();

  return time < currTime;
};
