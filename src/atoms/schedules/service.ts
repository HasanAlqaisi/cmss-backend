import { Prisma } from "@prisma/client";
import prisma from "../../prisma";
import generateSchedule from "../../algorithms/genetic-algorithm/generate-schedule";

export default class ScheduleService {
  static createSchedule = async () => {
    await this.deleteSchedule();

    const generatedSchedule = await generateSchedule();

    await prisma.schedule.createMany({
      data: generatedSchedule!.genes,
    });

    const schedules = await this.getSchedules();

    return {
      conflicts: 1 / generatedSchedule.fitness - 1,
      schedules,
    };
  };

  static deleteSchedule = async () => {
    await prisma.schedule.deleteMany();
  };

  static getSchedules = async () => {
    const schedules = await prisma.schedule.findMany({
      select: {
        class: {
          select: {
            id: true,
            stage: true,
            branch: true,
            program: true,
          },
        },
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
            teacher: { select: { fullName: true, username: true } },
          },
        },
      },
    });
    return schedules;
  };

  static getSchedulesForProgram = async (programId: number) => {
    const schedules = await prisma.schedule.findMany({
      where: { class: { programId } },
      select: {
        class: {
          select: {
            id: true,
            stage: true,
            branch: true,
            program: true,
          },
        },
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
            teacher: { select: { fullName: true, username: true } },
          },
        },
      },
    });
    return schedules;
  };
}

export type ScheduleType = Prisma.PromiseReturnType<
  typeof ScheduleService.getSchedules
>;
