/* eslint-disable no-param-reassign */
import { Day, Hour } from "@prisma/client";
// import { mutationRate } from "../utils/constants";
import { Chromosome, Gene } from "../../../atoms/schedules/types";
import logger from "../../../utils/config/logger";
import getRandomInt from "../../../utils/get-random-int";
import { daysLength, hoursLength } from "../utils/constants";

export default (
  chromosome: Chromosome,
  days: Day[],
  hours: Hour[],
  mutationRate: number,
  worstGenes: { worstGene: Gene; isDayConflict: number }[]
) => {
  // let worstIndex = -1;
  // let secondWorstIndex = -1;

  for (let index = 0; index < chromosome.genes.length; index++) {
    const currentGene = chromosome.genes[index];
    // if (worstGenes.includes(currentGene)) {
    //   const flip = getRandomInt(2);
    //   if (flip === 1) {
    //     const dayId = getRandomInt(daysLength) + 1;
    //     const randomDayId = days.find((day) => day.id === dayId)!.id;
    //     chromosome.genes[index].dayId = randomDayId;
    //   } else {
    //     const hourId = getRandomInt(hoursLength) + 1;
    //     const randomHourId = days.find((hour) => hour.id === hourId)!.id;
    //     chromosome.genes[index].hourId = randomHourId;
    //   }
    // }

    // const worstGene = worstGenes.find((gene) => gene.worstGene === currentGene);

    // if (worstGene) {
    // worstIndex = index;
    // const { isDayConflict } = worstGene;

    // const flip = getRandomInt(2);
    // if (flip === 1) {
    chromosome.genes[index].dayId = getRandomInt(daysLength) + 1;
    // } else {
    // chromosome.genes[index].hourId = getRandomInt(hoursLength) + 1;
    // }
    // }

    // if (worstGenes.find((gene) => gene.secondWorstGene === currentGene)) {
    //   // secondWorstIndex = index;
    //   const flip = getRandomInt(6);
    //   if (flip === 3) {
    //     chromosome.genes[index].hourId = getRandomInt(hoursLength) + 1;
    //   } else {
    //     chromosome.genes[index].dayId = getRandomInt(daysLength) + 1;
    //   }
    // }

    // if (worstIndex !== -1 && secondWorstIndex !== -1) {
    //   // logger.debug(`worst ${worstIndex}, secondworst ${secondWorstIndex}`);
    //   const flip = getRandomInt(2);
    //   if (flip === 1) {
    //     [
    //       chromosome.genes[worstIndex].dayId,
    //       chromosome.genes[secondWorstIndex].dayId,
    //     ] = [
    //       chromosome.genes[secondWorstIndex].dayId,
    //       chromosome.genes[worstIndex].dayId,
    //     ];
    //   } else {
    //     [
    //       chromosome.genes[worstIndex].hourId,
    //       chromosome.genes[secondWorstIndex].hourId,
    //     ] = [
    //       chromosome.genes[secondWorstIndex].hourId,
    //       chromosome.genes[worstIndex].hourId,
    //     ];
    //   }
    //   break;
    // }
  }

  return chromosome;
};
