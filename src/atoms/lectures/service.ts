import { Class, Day, Hour, Lecture, Room, User } from "@prisma/client";
import _ from "lodash";
import prisma from "../../prisma";

const includeTeacherAndHall = {
  teacher: { select: { email: true, username: true, fullName: true } },
  hall: {
    include: {
      room: { select: { name: true, number: true } },
      subject: {
        select: {
          Class: {
            select: {
              id: true,
              branchId: true,
              stageId: true,
              programId: true,
              program: { select: { name: true } },
              stage: true,
            },
          },
          name: true,
          isElectronic: true,
          isLab: true,
        },
      },
    },
  },
};

export default class LectureService {
  static createLecture = async (
    teacherId: number,
    roomId: number,
    subjectId: number
  ): Promise<Lecture> => {
    const lecture = await prisma.lecture.create({
      data: {
        teacher: { connect: { id: teacherId } },
        hall: {
          connectOrCreate: {
            where: { roomId_subjectId: { roomId, subjectId } },
            create: {
              room: { connect: { id: roomId } },
              subject: { connect: { id: subjectId } },
            },
          },
        },
      },
      include: includeTeacherAndHall,
    });

    return lecture;
  };

  static getLectures = async () => {
    const lectures = await prisma.lecture.findMany({
      include: includeTeacherAndHall,
    });
    return lectures;
  };

  static deleteLecture = async (lectureId: number): Promise<void> => {
    await prisma.lecture.delete({ where: { id: lectureId } });
  };

  static updateLecture = async (
    id: number,
    teacherId: number,
    roomId: number,
    subjectId: number
  ): Promise<Lecture> => {
    const lecture = await prisma.lecture.update({
      where: { id },
      data: {
        teacher: { connect: { id: teacherId } },
        hall: {
          connectOrCreate: {
            where: { roomId_subjectId: { roomId, subjectId } },
            create: {
              room: { connect: { id: roomId } },
              subject: { connect: { id: subjectId } },
            },
          },
        },
      },
      include: includeTeacherAndHall,
    });

    return lecture;
  };

  static getDays = async (): Promise<Day[]> => {
    const days = await prisma.day.findMany();
    return days;
  };

  static gethours = async (): Promise<Hour[]> => {
    const hours = await prisma.hour.findMany();
    return hours;
  };

  static getClasses = async (): Promise<Class[]> => {
    const classes = await prisma.class.findMany();
    return classes;
  };

  static getRooms = async (): Promise<Room[]> => {
    const rooms = await prisma.room.findMany();
    return rooms;
  };

  static getTeachers = async (): Promise<User[]> => {
    const teachers = await prisma.user.findMany({
      where: { role: { name: "attendance_manager" } },
    });
    return teachers;
  };
}
