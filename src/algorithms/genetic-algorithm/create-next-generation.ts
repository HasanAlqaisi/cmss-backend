/* eslint-disable no-import-assign */
import { Day } from "@prisma/client";
import getRandomInt from "../../utils/get-random-int";
import { crossoverRate, elitismRate, populationSize } from "./utils/constants";
import { Chromosome } from "../../atoms/schedules/types";
import mutateDay from "./mutation/mutate-day";
import tournamentSelect from "./selection/tournament-select";
import uniformCrossover from "./crossover/uniform-crossover";
import getNFittestChromosome from "./utils/get-n-fittest-chromosomes";

export default (
  previousGeneration: Chromosome[],
  days: Day[]
): Chromosome[] => {
  const nextGeneration: Chromosome[] = [];

  const fittersNumber = populationSize * elitismRate;

  const fitters = getNFittestChromosome(previousGeneration, fittersNumber);

  fitters.forEach((fitter) => nextGeneration.push(fitter));

  for (let i = 0; i < populationSize / 2 - fittersNumber / 2; i++) {
    const firstParent = tournamentSelect(previousGeneration, fitters);
    const secondParent = tournamentSelect(previousGeneration, fitters);

    let offspring1: Chromosome;
    let offspring2: Chromosome;

    const crossOverProb = getRandomInt(100) + 1;
    const shouldCross = crossOverProb <= crossoverRate;

    if (shouldCross) {
      [offspring1, offspring2] = uniformCrossover(firstParent, secondParent);
    } else if (getRandomInt(2) === 1) {
      offspring1 = mutateDay(firstParent, days);
      offspring2 = secondParent;
    } else {
      offspring2 = mutateDay(secondParent, days);
      offspring1 = firstParent;
    }

    nextGeneration.push(offspring1);
    nextGeneration.push(offspring2);
  }
  return nextGeneration;
};
