/* eslint-disable camelcase */
import { Prisma } from "@prisma/client";
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

  static getAttendance = async (
    id?: number,
    lectureId_studentId_date?: {
      lectureId: number;
      studentId: number;
      date: Date;
    }
  ) => {
    const attendance = await prisma.attendance.findUnique({
      where: { id, lectureId_studentId_date },
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

  static createAttendance = async (
    input: InputAttendance,
    studentId?: number
  ) => {
    const attendance = await prisma.attendance.create({
      data: {
        lecture: {
          connect: { id: input.lectureId },
        },
        student: { connect: { id: input.studentId || studentId } },
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

  static createAttendances = async (lectureId: number, students: number[]) => {
    const data = students.map((student) => ({
      lectureId,
      studentId: student,
    }));

    const attendances = await prisma.attendance.createMany({
      data,
      skipDuplicates: true,
    });

    return attendances;
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

  static toggleAttendance = async (
    input: InputAttendance,
    currentAttend: boolean
  ) => {
    logger.debug(input.date);
    const attendance = await prisma.attendance.update({
      where: {
        lectureId_studentId_date: {
          lectureId: input.lectureId,
          studentId: input.studentId!,
          date: input.date || new Date(),
        },
      },
      data: {
        lecture: {
          connect: {
            id: input.lectureId,
          },
        },
        student: { connect: { id: input.studentId } },
        note: input.note,
        date: input.date,
        attended: !currentAttend,
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

export type GetAttendancesType = Prisma.PromiseReturnType<
  typeof AttendanceService.getAttendances
>;
