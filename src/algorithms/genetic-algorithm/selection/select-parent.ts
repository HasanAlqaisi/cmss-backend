import getRandomInt from "../../../utils/get-random-int";
import { Chromosome } from "../../../atoms/schedules/types";
import {
  populationSize,
  tournamentSize,
} from "../constants";
import logger from "../../../utils/config/logger";

// Selection is a step of GA and I will do it using Wheel Selection strategy to choose a parent (chromosome)
// export default (
//   previousGeneration: Chromosome[],
//   totalFitness: number
// ): Chromosome => {
//   let parent: Chromosome = new Chromosome([], 0);
//   const randomNumber = getRandomInt(totalFitness);
//   let partialSum = 0;

//    
//   for (let index = 0; index < previousGeneration.length; index++) {
//     const element = previousGeneration[index];
//     partialSum += element.fitness;
//     if (partialSum >= randomNumber) {
//       parent = element;
//       break;
//     }
//   }

//   return parent;
// };

export function getBestChromosome(
  leftIndex: number,
  rightIndex: number,
  previousGeneration: Chromosome[]
) {
  let bestChromosomeIndex = -1;
  let bestFitness = -1;
   
  for (let i = leftIndex; i < rightIndex; i++) {
    const currentFitness = previousGeneration[i].fitness;
    if (currentFitness > bestFitness) {
      bestFitness = currentFitness;
      bestChromosomeIndex = i;
    }
  }
  return bestChromosomeIndex;
}

export function getSecondFittest(previousGeneration: Chromosome[]) {
  let maxFit1 = 0;
  let maxFit2 = 0;
   
  for (let i = 0; i < previousGeneration.length; i++) {
    if (previousGeneration[i].fitness > previousGeneration[maxFit1].fitness) {
      maxFit2 = maxFit1;
      maxFit1 = i;
    } else if (
      previousGeneration[i].fitness > previousGeneration[maxFit2].fitness
    ) {
      maxFit2 = i;
    }
  }
  return previousGeneration[maxFit2];
}

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

// export default (previousGeneration: Chromosome[]) => {
//   const index1 = getRandomInt(previousGeneration.length);
//   const index2 = getRandomInt(previousGeneration.length);

//   if (index1 < index2) {
//     return getBestChromosome(index1, index2 + 1, previousGeneration);
//   }
//   return getBestChromosome(index2, index1 + 1, previousGeneration);
// };

export default (previousGeneration: Chromosome[]) => {
  const selectedChromosomes: Chromosome[] = [];
  let bestFitness = 0;
  let bestOne: Chromosome;

   
  for (let index = 0; index < tournamentSize; index++) {
    const randomIndex = getRandomInt(previousGeneration.length);
    const chromosome = previousGeneration[randomIndex];
    selectedChromosomes.push(chromosome);

    const currentFitness = selectedChromosomes[index].fitness;
    if (currentFitness > bestFitness) {
      bestFitness = currentFitness;
      bestOne = selectedChromosomes[index];
    }
  }
  return bestOne!;
};
