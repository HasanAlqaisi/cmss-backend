/* eslint-disable no-param-reassign */
import { Day, Hour } from "@prisma/client";
import { mutationRate } from "../utils/constants";
import { Chromosome } from "../../../atoms/schedules/types";
import getRandomInt from "../../../utils/get-random-int";

export default (chromosome: Chromosome, days: Day[], hours: Hour[]) => {
  for (let index = 0; index < chromosome.genes.length; index++) {
    if (getRandomInt(1000) + 1 < mutationRate) {
      const randomIndex1 = getRandomInt(chromosome.genes.length, 0);
      const randomIndex2 = getRandomInt(chromosome.genes.length, 0);

      [
        chromosome.genes[randomIndex1].hourId,
        chromosome.genes[randomIndex1].dayId,
      ] = [
        chromosome.genes[randomIndex2].hourId,
        chromosome.genes[randomIndex2].dayId,
      ];
    }
  }

  return chromosome;
};
