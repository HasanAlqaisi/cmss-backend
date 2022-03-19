/* eslint-disable prefer-const */
/* eslint-disable import/no-mutable-exports */
export const populationSize: number = 700;
export const maxGeneration: number = 100;
let tournamentSize: number = 5;

let crossoverRate = 100;
let mutationRate = 1;

export const daysLength: number = 6;
export const hoursLength: number = 4;
export const lecturesLength: number = 200; // Approximation

export const electronicRoomNumber = 1000;

export const changeTunes = (
  crossoverChange: number,
  mutationChange: number,
  tournamentChange: number
) => {
  crossoverRate = crossoverChange;
  mutationRate = mutationChange;
  tournamentSize = tournamentChange;
};

export const getTunes = () => ({ crossoverRate, mutationRate, tournamentSize });
