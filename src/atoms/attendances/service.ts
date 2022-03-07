import prisma from "../../prisma";
import logger from "../../utils/config/logger";
import { InputAttendance } from "./types";

export default class AttendanceService {
  static getAttendances = async (
    lectureId?: number,
    studentId?: number,
    date?: Date
  ) => {
    const attendance = await prisma.attendance.findMany({
      where: { lectureId, studentId, date },
      include: {
        student: { include: { Class: true } },
        lecture: {
          include: {
            hall: {
              include: { room: true, subject: { include: { Class: true } } },
            },
          },
        },
      },
    });
    return attendance;
  };

  static createAttendance = async (input: InputAttendance) => {
    const attendance = await prisma.attendance.create({
      data: {
        lecture: {
          connect: { id: input.lectureId },
        },
        student: { connect: { id: input.studentId } },
        note: input.note,
        date: input.date,
        attended: input.attended,
      },
    });

    return attendance;
  };

  static deleteAttendance = async (id: number): Promise<void> => {
    await prisma.attendance.delete({ where: { id } });
  };

  static updateAttendance = async (id: number, input: InputAttendance) => {
    logger.debug(input.date);
    const attendance = await prisma.attendance.update({
      where: { id },
      data: {
        lecture: {
          connect: {
            id: input.lectureId,
          },
        },
        student: { connect: { id: input.studentId } },
        note: input.note,
        date: input.date,
        attended: input.attended,
      },
      include: {
        student: { include: { Class: true } },
        lecture: {
          include: {
            hall: {
              include: { room: true, subject: { include: { Class: true } } },
            },
          },
        },
      },
    });

    return attendance;
  };
}
