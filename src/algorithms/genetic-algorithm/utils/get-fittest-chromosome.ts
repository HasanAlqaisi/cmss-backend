import { Chromosome } from "../../../atoms/schedules/types";

// eslint-disable-next-line import/prefer-default-export
export default (
  leftIndex: number,
  rightIndex: number,
  previousGeneration: Chromosome[]
) => {
  let bestChromosomeIndex = -1;
  let bestFitness = -1;

  for (let i = leftIndex; i < rightIndex; i++) {
    const currentFitness = previousGeneration[i].fitness;
    if (currentFitness > bestFitness) {
      bestFitness = currentFitness;
      bestChromosomeIndex = i;
    }
  }
  return previousGeneration[bestChromosomeIndex];
};
