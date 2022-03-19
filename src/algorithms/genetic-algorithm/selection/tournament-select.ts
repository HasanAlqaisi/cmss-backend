import { Chromosome } from "../../../atoms/schedules/types";
import getRandomInt from "../../../utils/get-random-int";
import { getTunes } from "../utils/constants";

export default (previousGeneration: Chromosome[], leasters: Chromosome[]) => {
  const { tournamentSize } = getTunes();
  const selectedChromosomes: Chromosome[] = [];
  let bestFitness = 0;
  let worstFitness = 1;
  let bestOne: Chromosome;
  let worstOne: Chromosome;

  for (let index = 0; index < tournamentSize; index++) {
    let randomIndex = getRandomInt(previousGeneration.length);
    let chromosome: Chromosome = previousGeneration[randomIndex];

    while (leasters.includes(chromosome)) {
      randomIndex = getRandomInt(previousGeneration.length);
      chromosome = previousGeneration[randomIndex];
    }

    selectedChromosomes.push(chromosome);

    const currentFitness = selectedChromosomes[index].fitness;
    if (currentFitness > bestFitness) {
      bestFitness = currentFitness;
      bestOne = selectedChromosomes[index];
    }
    if (currentFitness < worstFitness) {
      worstFitness = currentFitness;
      worstOne = selectedChromosomes[index];
    }
  }

  let theOne: Chromosome;
  const probForTheBest = getRandomInt(100) + 1;
  if (probForTheBest <= 100) {
    theOne = bestOne!;
  } else {
    theOne = worstOne!;
  }
  return theOne;
};
