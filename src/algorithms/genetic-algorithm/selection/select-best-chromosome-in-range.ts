import { Chromosome } from "../../../atoms/schedules/types";
import getRandomInt from "../../../utils/get-random-int";
import getFittestChromosome from "../utils/get-fittest-chromosome";

export default (previousGeneration: Chromosome[]) => {
  const index1 = getRandomInt(previousGeneration.length);
  const index2 = getRandomInt(previousGeneration.length);

  if (index1 < index2) {
    return getFittestChromosome(index1, index2 + 1, previousGeneration);
  }
  return getFittestChromosome(index2, index1 + 1, previousGeneration);
};
