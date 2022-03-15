import { Chromosome } from "../../../atoms/schedules/types";

// eslint-disable-next-line import/prefer-default-export
export function getLeastFittestChromosome(previousGeneration: Chromosome[]) {
  let minFitVal = 1;
  let minFitIndex = -1;

  for (let i = 0; i < previousGeneration.length; i++) {
    if (minFitVal >= previousGeneration[i].fitness) {
      minFitVal = previousGeneration[i].fitness;
      minFitIndex = i;
    }
  }
  return minFitIndex;
}
