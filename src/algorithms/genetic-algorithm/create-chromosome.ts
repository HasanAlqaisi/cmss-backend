import { Day, Hour } from "@prisma/client";
import { Chromosome, FullLectures, Gene } from "../../atoms/schedules/types";
import createGene from "./create-gene";

export default (
  lectures: FullLectures,
  days: Day[],
  hours: Hour[]
): Chromosome => {
  const genes: Gene[] = [];

  for (let index = 0; index < lectures.length; index++) {
    genes.push(createGene(index, lectures, days, hours));
  }
  return new Chromosome(genes, 0);
};
