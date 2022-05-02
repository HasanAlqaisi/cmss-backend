/* eslint-disable no-param-reassign */
import { Hour } from "@prisma/client";
import { Chromosome } from "../../../atoms/schedules/types";
import getRandomInt from "../../../utils/get-random-int";
import { hoursLength } from "../utils/constants";

export default (chromosome: Chromosome, hours: Hour[]) => {
  const randomIndex = getRandomInt(chromosome.genes.length);

  const randomHourId = getRandomInt(hoursLength) + 1;
  const newHour = hours.find((hour) => hour.id === randomHourId);

  chromosome.genes[randomIndex].hourId = newHour!.id;

  return chromosome;
};
