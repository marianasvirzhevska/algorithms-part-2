export interface Job {
  id: number,
  message: string,
  priority: number,
}

const generatePriority = (amount: number): number => Math.floor(Math.random() * amount);

export const getJobs = (amount: number): Job[] =>
  [...Array(amount).keys()]
  .map((el: number): Job => ({
    id: el,
    message: `Job id: ${el}`,
    priority: generatePriority(amount),
  }));
