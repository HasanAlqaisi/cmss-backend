/* eslint-disable no-param-reassign */
import { Day, Hour } from "@prisma/client";
import { daysLength, hoursLength, mutationRate } from "../constants";
import { Chromosome, FullLectures } from "../../../atoms/schedules/types";
import getRandomInt from "../../../utils/get-random-int";
import createChromosome from "../create-chromosome";

// export default (
//   lectures: FullLectures,
//   days: Day[],
//   hours: Hour[]
// ): Chromosome => createChromosome(lectures, days, hours);

export default (
  chromosome: Chromosome,
  days: Day[],
  hours: Hour[]
): Chromosome => {
  // eslint-disable-next-line no-plusplus
  const randomIndex = getRandomInt(
    chromosome.genes.length,
    chromosome.genes.length / 2
  );

  const randomDayId = getRandomInt(daysLength) + 1;
  const dayId = days.find((element) => element.id === randomDayId)!.id;

  chromosome.genes[randomIndex].dayId = dayId;

  return chromosome;
};
