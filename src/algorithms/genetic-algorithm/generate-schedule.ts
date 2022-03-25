import { Chromosome } from "../../atoms/schedules/types";
import createNextGeneration from "./create-next-generation";
import computeFitness from "./compute-fitness";
import initPopulation from "./init-population";
import logger from "../../utils/config/logger";
import LectureService from "../../atoms/lectures/service";
import { maxGeneration, populationSize } from "./utils/constants";
import evolveLabRooms from "./utils/evolve-lab-rooms";

export default async () => {
  const [lectures, days, hours, classes, rooms] = await Promise.all([
    LectureService.getLectures(),
    LectureService.getDays(),
    LectureService.gethours(),
    LectureService.getClasses(),
    LectureService.getRooms(),
  ]);

  let nextGeneration: Chromosome[] = initPopulation(lectures, days, hours);

  let generationCount: number = 0;
  const bestChromosome: Chromosome = new Chromosome([], 0);
  let bestFitness = 0;

  while (generationCount < maxGeneration && bestFitness < 1) {
    generationCount += 1;
    let bestGenerationFitness = 0;

    for (let i = 0; i < populationSize; i++) {
      nextGeneration[i] = evolveLabRooms(nextGeneration[i], lectures);

      computeFitness(nextGeneration[i], lectures, days, hours, classes, rooms);

      if (bestGenerationFitness < nextGeneration[i].fitness) {
        bestGenerationFitness = nextGeneration[i].fitness;
      }

      if (bestFitness < nextGeneration[i].fitness) {
        bestFitness = nextGeneration[i].fitness;
        bestChromosome.genes = nextGeneration[i].genes;
        bestChromosome.fitness = nextGeneration[i].fitness;
      }

      if (bestFitness === 1) break;
    }

    logger.debug(
      `best fitness for generation ${generationCount} = ${bestGenerationFitness}`
    );

    if (bestFitness === 1) {
      break;
    } else {
      nextGeneration = createNextGeneration(nextGeneration, days);
    }
  }

  logger.debug(
    `bestFitness ${bestFitness}, bestChromosome.fitness ${bestChromosome.fitness}`
  );

  return bestChromosome;
};
