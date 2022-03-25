import { Chromosome } from "../../../atoms/schedules/types";
import getRandomInt from "../../../utils/get-random-int";
import { tournamentSize } from "../utils/constants";

export default (previousGeneration: Chromosome[], fitters: Chromosome[]) => {
  const selectedChromosomes: Chromosome[] = [];
  let bestFitness = 0;
  let bestOne = new Chromosome([], 0);

  for (let index = 0; index < tournamentSize; index++) {
    let randomIndex = getRandomInt(previousGeneration.length);
    let chromosome: Chromosome = previousGeneration[randomIndex];

    while (fitters.includes(chromosome)) {
      randomIndex = getRandomInt(previousGeneration.length);
      chromosome = previousGeneration[randomIndex];
    }

    selectedChromosomes.push(chromosome);

    const currentFitness = selectedChromosomes[index].fitness;
    if (currentFitness > bestFitness) {
      bestFitness = currentFitness;
      bestOne = selectedChromosomes[index];
    }
  }

  return bestOne;
};
