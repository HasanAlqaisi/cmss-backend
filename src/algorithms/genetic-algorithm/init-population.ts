import { Day, Hour } from "@prisma/client";
import { Chromosome, FullLectures, Gene } from "../../atoms/schedules/types";
import { populationSize } from "./constants";
import createChromosome from "./create-chromosome";

export default (
  lectures: FullLectures,
  days: Day[],
  hours: Hour[]
): Chromosome[] => {
  const chromosomes: Chromosome[] = [];

  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < populationSize; index++) {
    chromosomes.push(createChromosome(lectures, days, hours));
  }

  return chromosomes;
};
