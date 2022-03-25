/* eslint-disable no-param-reassign */
import { Day, Hour } from "@prisma/client";
import { Chromosome } from "../../../atoms/schedules/types";
import getRandomInt from "../../../utils/get-random-int";
import { daysLength, hoursLength } from "../utils/constants";

export default (chromosome: Chromosome, days: Day[], hours: Hour[]) => {
  const randomIndex = getRandomInt(chromosome.genes.length);

  const randomDayId = getRandomInt(daysLength) + 1;
  const newDay = days.find((day) => day.id === randomDayId);
  const randomHourId = getRandomInt(hoursLength) + 1;
  const newHour = hours.find((hour) => hour.id === randomHourId);

  chromosome.genes[randomIndex].dayId = newDay!.id;
  chromosome.genes[randomIndex].hourId = newHour!.id;

  return chromosome;
};
