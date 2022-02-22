import { Subject } from "@prisma/client";
import prisma from "../../prisma";
import { Chromosome } from "../../atoms/schedules/types";
import createNextGeneration from "./create-next-generation";
import computeFitness from "./fitness/compute-fitness";
import initPopulation from "./init-population";
import writeChromosomesToFile from "./write-chromosomes-to-file";
import logger from "../../utils/config/logger";
import LectureService from "../../atoms/lectures/service";
import { maxGeneration, populationSize } from "./constants";

export default async () => {
  const lectures = await LectureService.getLectures();
  const days = await LectureService.getDays();
  const hours = await LectureService.gethours();
  const classes = await LectureService.getClasses();
  const rooms = await LectureService.getRooms();
  const teachers = await LectureService.getTeachers();

  // logger.debug(
  //   `lectures: ${lectures.length}\ndays: ${days.length}\nhours: ${hours.length}\nclasses: ${classes.length}\nrooms: ${rooms.length}\nteachers: ${teachers.length}`
  // );

  let nextGeneration: Chromosome[] = initPopulation(lectures, days, hours);

  let generationCount: number = 0;
  const bestChromosome: Chromosome = new Chromosome([], 0);
  let bestFitness = 0;

  while (generationCount < maxGeneration) {
    generationCount += 1;

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < populationSize; i++) {
      computeFitness(
        nextGeneration[i],
        lectures,
        days,
        hours,
        classes,
        rooms,
        teachers
      );

      if (bestFitness < nextGeneration[i].fitness) {
        bestFitness = nextGeneration[i].fitness;
        bestChromosome.genes = nextGeneration[i].genes;
        bestChromosome.fitness = nextGeneration[i].fitness;
      }

      if (bestFitness === 1) {
        break;
      }
    }

    logger.debug(
      `best fitness of generation ${generationCount} is ${bestFitness}\n`
    );
    // if (generationCount === 50) {
    //   writeChromosomesToFile(`99.json`, nextGeneration);
    // }
    // if (generationCount === 51) {
    //   writeChromosomesToFile(`100.json`, nextGeneration);
    // }

    if (bestFitness === 1) {
      break;
    } else {
      nextGeneration = createNextGeneration(
        nextGeneration,
        // bestChromosome,
        days,
        hours,
        lectures
      );
    }
  }

  logger.debug(
    `bestFitness ${bestFitness}, bestChromosome.fitness ${bestChromosome.fitness}`
  );

  logger.debug(`best fitness is ${bestChromosome.fitness}`);
  return bestChromosome;
};
