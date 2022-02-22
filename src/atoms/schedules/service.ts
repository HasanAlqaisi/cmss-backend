import { Subject } from "@prisma/client";
import prisma from "../../prisma";
import { Chromosome, Gene } from "./types";
import createNextGeneration from "../../algorithms/genetic-algorithm/create-next-generation";
import computeFitness from "../../algorithms/genetic-algorithm/fitness/compute-fitness";
import initPopulation from "../../algorithms/genetic-algorithm/init-population";
import writeChromosomesToFile from "../../algorithms/genetic-algorithm/write-chromosomes-to-file";
import { maxGeneration, populationSize } from "../../algorithms/genetic-algorithm/constants";
import logger from "../../utils/config/logger";
import LectureService from "../lectures/service";
import generateSchedule from "../../algorithms/genetic-algorithm/generate-schedule";

export default class ScheduleService {
  static createSchedule = async () => {
    await this.deleteSchedule();
    const generatedSchedules = await generateSchedule();
    // if (generatedSchedules.fitness === 1) {
    //   await prisma.schedule.createMany({
    //     data: generatedSchedules.genes,
    //   });
    //   response = await this.getSchedules();
    // } else {
    //   response = "couldn't find a good schedule, try again!";
    // }

    await prisma.schedule.createMany({
      data: generatedSchedules.genes,
    });
    const response = await this.getSchedules();
    return response;
  };

  static deleteSchedule = async () => {
    await prisma.schedule.deleteMany();
  };

  static getSchedules = async () => {
    const schedules = await prisma.schedule.findMany({
      select: {
        class: { select: { id: true } },
        day: { select: { number: true } },
        hour: { select: { start: true } },
        lecture: {
          select: {
            hall: {
              select: {
                subject: { select: { name: true } },
                room: { select: { number: true } },
              },
            },
            teacher: { select: { username: true } },
          },
        },
      },
    });
    return schedules;
  };
}
