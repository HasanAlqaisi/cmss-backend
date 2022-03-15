import getRandomInt from "../../../utils/get-random-int";
import { Chromosome } from "../../../atoms/schedules/types";

export default (
  previousGeneration: Chromosome[],
  totalFitness: number
): Chromosome => {
  let parent: Chromosome = new Chromosome([], 0);
  const randomNumber = getRandomInt(totalFitness);
  let partialSum = 0;

  for (let index = 0; index < previousGeneration.length; index++) {
    const element = previousGeneration[index];
    partialSum += element.fitness;
    if (partialSum >= randomNumber) {
      parent = element;
      break;
    }
  }

  return parent;
};
