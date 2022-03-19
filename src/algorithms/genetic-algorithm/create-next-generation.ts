/* eslint-disable no-import-assign */
import { Day, Hour } from "@prisma/client";
import getRandomInt from "../../utils/get-random-int";
import {
  changeTunes,
  // crossoverRate,
  getTunes,
  // mutationRate,
  populationSize,
} from "./utils/constants";
import { Chromosome, Gene } from "../../atoms/schedules/types";
import mutate from "./mutation/mutate";
import getFittestChromosome from "./utils/get-fittest-chromosome";
import getSecondFittestChromosome from "./utils/get-second-fittest-chromosome";
import tournamentSelect from "./selection/tournament-select";
import onePointCrossover from "./crossover/one-point-crossover";
import twoPointCrossover from "./crossover/two-point-crossover";
import uniformCrossover from "./crossover/uniform-crossover";
import logger from "../../utils/config/logger";
import getNFittestChromosome from "./utils/get-n-fittest-chromosomes";
import getNLeastChromosomes from "./utils/get-n-least-chromosomes";

export default (
  previousGeneration: Chromosome[],
  days: Day[],
  hours: Hour[],
  generationCount: number,
  worstGenes: { worstGene: Gene; isDayConflict: number }[]
): Chromosome[] => {
  const nextGeneration: Chromosome[] = [];

  // const fittestChromosome = getFittestChromosome(
  //   0,
  //   previousGeneration.length,
  //   previousGeneration
  // );

  // const secondFittestChromosome =
  //   getSecondFittestChromosome(previousGeneration);

  const fitters = getNFittestChromosome(previousGeneration, 10);

  const leasters = getNLeastChromosomes(previousGeneration, 10);

  fitters.forEach((fitter) => nextGeneration.push(fitter));

  // let totalFitness = 0;
  // previousGeneration.forEach((chromosome) => {
  //   totalFitness += chromosome.fitness;
  // });

  const { crossoverRate, mutationRate } = getTunes();
  // if (generationCount > 60) {
  //   changeTunes(98, 2, 350);
  // }

  for (let i = 0; i < populationSize / 2 - 5; i++) {
    const firstParent = tournamentSelect(previousGeneration, leasters);
    const secondParent = tournamentSelect(previousGeneration, leasters);

    let offspring1: Chromosome;
    let offspring2: Chromosome;

    const crossOverProb = getRandomInt(100) + 1;
    const shouldCross = crossOverProb <= crossoverRate;

    if (shouldCross) {
      [offspring1, offspring2] = uniformCrossover(firstParent, secondParent);
    } else if (getRandomInt(2) === 1) {
      offspring1 = mutate(firstParent, days, hours, mutationRate, worstGenes);
      offspring2 = secondParent;
    } else {
      offspring2 = mutate(secondParent, days, hours, mutationRate, worstGenes);
      offspring1 = firstParent;
    }

    nextGeneration.push(offspring1);
    nextGeneration.push(offspring2);
  }
  return nextGeneration;
};
