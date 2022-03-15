import { Day, Hour } from "@prisma/client";
import getRandomInt from "../../utils/get-random-int";
import { crossoverRate, populationSize } from "./utils/constants";
import { Chromosome } from "../../atoms/schedules/types";
import mutate from "./mutation/mutate";
import getFittestChromosome from "./utils/get-fittest-chromosome";
import getSecondFittestChromosome from "./utils/get-second-fittest-chromosome";
import tournamentSelect from "./selection/tournament-select";
import onePointCrossover from "./crossover/one-point-crossover";
import twoPointCrossover from "./crossover/two-point-crossover";
import uniformCrossover from "./crossover/uniform-crossover";

export default (
  previousGeneration: Chromosome[],
  days: Day[],
  hours: Hour[]
): Chromosome[] => {
  const nextGeneration: Chromosome[] = [];

  const fittestChromosome = getFittestChromosome(
    0,
    previousGeneration.length,
    previousGeneration
  );

  const secondFittestChromosome =
    getSecondFittestChromosome(previousGeneration);

  nextGeneration.push(fittestChromosome);
  nextGeneration.push(secondFittestChromosome);

  // let totalFitness = 0;
  // previousGeneration.forEach((chromosome) => {
  //   totalFitness += chromosome.fitness;
  // });

  for (let i = 0; i < populationSize / 2 - 1; i++) {
    const firstParent = tournamentSelect(previousGeneration);
    const secondParent = tournamentSelect(previousGeneration);

    let offspring1: Chromosome;
    let offspring2: Chromosome;

    const crossOverProb = getRandomInt(100) + 1;
    const shouldCross = crossOverProb <= crossoverRate;

    if (shouldCross) {
      [offspring1, offspring2] = uniformCrossover(firstParent, secondParent);
    } else {
      offspring1 = mutate(firstParent, days, hours);
      offspring2 = mutate(secondParent, days, hours);
    }

    nextGeneration.push(offspring1);
    nextGeneration.push(offspring2);
  }
  return nextGeneration;
};
