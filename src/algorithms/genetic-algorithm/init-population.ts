import { Day, Hour } from "@prisma/client";
import { Chromosome, FullLectures } from "../../atoms/schedules/types";
import { populationSize } from "./utils/constants";
import createChromosome from "./create-chromosome";

export default (
  lectures: FullLectures,
  days: Day[],
  hours: Hour[]
): Chromosome[] => {
  const chromosomes: Chromosome[] = [];

  for (let index = 0; index < populationSize; index++) {
    chromosomes.push(createChromosome(lectures, days, hours));
  }

  return chromosomes;
};
