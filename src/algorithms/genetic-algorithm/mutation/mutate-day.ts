/* eslint-disable no-param-reassign */
import { Day } from "@prisma/client";
// import { mutationRate } from "../utils/constants";
import { Chromosome } from "../../../atoms/schedules/types";
import getRandomInt from "../../../utils/get-random-int";
import { daysLength } from "../utils/constants";

export default (chromosome: Chromosome, days: Day[]) => {
  const randomIndex = getRandomInt(chromosome.genes.length);

  const randomDayId = getRandomInt(daysLength) + 1;
  const newDay = days.find((day) => day.id === randomDayId);

  chromosome.genes[randomIndex].dayId = newDay!.id;

  return chromosome;
};
