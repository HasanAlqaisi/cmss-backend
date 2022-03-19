import { Subject } from "@prisma/client";
import prisma from "../../prisma";
import { Chromosome, Gene } from "./types";
import generateSchedule from "../../algorithms/genetic-algorithm/generate-schedule";

export default class ScheduleService {
  static createSchedule = async () => {
    await this.deleteSchedule();

    const generatedSchedule = await generateSchedule();

    await prisma.schedule.createMany({
      data: generatedSchedule!.bestChromosome.genes,
    });

    const schedule = await this.getSchedules();

    return {
      conflicts: 1 / generatedSchedule.bestChromosome.fitness - 1,
      voElectronicWithAttendanceSameDay:
        generatedSchedule.voElectronicWithAttendanceSameDay,
      voLabMultipleRoomsNotInSameTimeSlot:
        generatedSchedule.voLabMultipleRoomsNotInSameTimeSlot,
      voLecturesSameRoomSameTime: generatedSchedule.voLecturesSameRoomSameTime,
      voStageHasLectureInForbiddenDay:
        generatedSchedule.voStageHasLectureInForbiddenDay,
      voTeacherWithLecturesSameTime:
        generatedSchedule.voTeacherWithLecturesSameTime,
      voLecturesSameClassSameTime:
        generatedSchedule.voLecturesSameClassSameTime,
      schedule,
    };
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
