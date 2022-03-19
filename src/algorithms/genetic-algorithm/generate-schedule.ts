import { Chromosome, Gene } from "../../atoms/schedules/types";
import createNextGeneration from "./create-next-generation";
import computeFitness from "./compute-fitness";
import initPopulation from "./init-population";
import logger from "../../utils/config/logger";
import LectureService from "../../atoms/lectures/service";
import { maxGeneration, populationSize } from "./utils/constants";

export default async () => {
  const lectures = await LectureService.getLectures();
  const days = await LectureService.getDays();
  const hours = await LectureService.gethours();
  const classes = await LectureService.getClasses();
  const rooms = await LectureService.getRooms();

  let nextGeneration: Chromosome[] = initPopulation(lectures, days, hours);

  let generationCount: number = 0;
  const bestChromosome: Chromosome = new Chromosome([], 0);
  let voElectronicWithAttendanceSameDay = 0;
  let voLabMultipleRoomsNotInSameTimeSlot = 0;
  let voLecturesSameRoomSameTime = 0;
  let voStageHasLectureInForbiddenDay = 0;
  let voTeacherWithLecturesSameTime = 0;
  let voLecturesSameClassSameTime = 0;
  let bestFitness = 0;
  let bestGenerationFitness = 0;

  while (generationCount < maxGeneration && bestFitness < 1) {
    generationCount += 1;
    const worstGenes: { worstGene: Gene; isDayConflict: number }[] = [];

    for (let i = 0; i < populationSize; i++) {
      const {
        worstGene,
        isDayConflictForWorst,
        vioElectronicWithAttendanceSameDay,
        vioLabMultipleRoomsNotInSameTimeSlot,
        vioLecturesSameRoomSameTime,
        vioStageHasLectureInForbiddenDay,
        vioTeacherWithLecturesSameTime,
        vioLecturesSameClassSameTime,
      } = computeFitness(
        nextGeneration[i],
        lectures,
        days,
        hours,
        classes,
        rooms
      );

      worstGenes.push({
        worstGene: worstGene!,
        isDayConflict: isDayConflictForWorst!,
      });

      if (bestGenerationFitness < nextGeneration[i].fitness) {
        bestGenerationFitness = nextGeneration[i].fitness;
      }

      if (bestFitness < nextGeneration[i].fitness) {
        bestFitness = nextGeneration[i].fitness;
        bestChromosome.genes = nextGeneration[i].genes;
        bestChromosome.fitness = nextGeneration[i].fitness;
        voElectronicWithAttendanceSameDay = vioElectronicWithAttendanceSameDay;
        voLabMultipleRoomsNotInSameTimeSlot =
          vioLabMultipleRoomsNotInSameTimeSlot;
        voLecturesSameRoomSameTime = vioLecturesSameRoomSameTime;
        voStageHasLectureInForbiddenDay = vioStageHasLectureInForbiddenDay;
        voTeacherWithLecturesSameTime = vioTeacherWithLecturesSameTime;
        voLecturesSameClassSameTime = vioLecturesSameClassSameTime;
      }

      if (bestFitness === 1) break;
    }

    logger.debug(
      `best fitness for generation ${generationCount} = ${bestGenerationFitness}`
    );

    bestGenerationFitness = 0;

    if (bestFitness === 1) {
      break;
    } else {
      nextGeneration = createNextGeneration(
        nextGeneration,
        days,
        hours,
        generationCount,
        worstGenes
        // lectures,
      );
    }
  }

  logger.debug(
    `bestFitness ${bestFitness}, bestChromosome.fitness ${bestChromosome.fitness}`
  );

  return {
    bestChromosome,
    voElectronicWithAttendanceSameDay,
    voLabMultipleRoomsNotInSameTimeSlot,
    voLecturesSameRoomSameTime,
    voStageHasLectureInForbiddenDay,
    voTeacherWithLecturesSameTime,
    voLecturesSameClassSameTime,
  };
};
