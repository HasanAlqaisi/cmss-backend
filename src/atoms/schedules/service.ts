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
        day: { select: { id: true, number: true } },
        hour: { select: { id: true, start: true } },
        lecture: {
          select: {
            hall: {
              select: {
                subject: { select: { id: true, name: true } },
                room: { select: { id: true, number: true } },
              },
            },
            teacher: { select: { id: true, fullName: true, username: true } },
          },
        },
      },
    });
    return schedules;
  };
}
