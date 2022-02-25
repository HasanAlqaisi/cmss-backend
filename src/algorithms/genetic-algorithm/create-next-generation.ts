import { Day, Hour } from "@prisma/client";
import getRandomInt from "../../utils/get-random-int";
import { crossoverRate, mutationRate, populationSize } from "./constants";
import { Chromosome, FullLectures } from "../../atoms/schedules/types";
import doCrossover from "./crossover/do-crossover";
import mutate from "./mutation/mutate";
import selectParent, {
  getBestChromosome,
  getLeastFittestChromosome,
} from "./selection/select-parent";
import logger from "../../utils/config/logger";

export default (
  previousGeneration: Chromosome[],
  days: Day[],
  hours: Hour[],
  lectures: FullLectures
): Chromosome[] => {
  const nextGeneration: Chromosome[] = [];

  const bestChromoIndex = getBestChromosome(
    0,
    previousGeneration.length,
    previousGeneration
  );
  nextGeneration.push(previousGeneration[bestChromoIndex]);

   
  for (let i = 0; i < populationSize - 1; i++) {
    const firstParent = selectParent(previousGeneration);
    const secondParent = selectParent(previousGeneration);

    let newChromosome: Chromosome;

    const crossOverProb = getRandomInt(100) + 1;
    const shouldCross = crossOverProb <= crossoverRate; // 90%
    if (shouldCross) {
      newChromosome = doCrossover(firstParent, secondParent);
    } else {
      newChromosome = firstParent;
    }
    const mutateProbability = getRandomInt(100) + 1;
    const shouldMutate = mutateProbability <= mutationRate; // 1%
    if (shouldMutate) {
      newChromosome = mutate(newChromosome, days, hours);
    }
    nextGeneration.push(newChromosome);
  }
  return nextGeneration;
};
