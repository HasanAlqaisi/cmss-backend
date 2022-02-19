import { Lecture, User } from "@prisma/client";
import _ from "lodash";
import prisma from "../../prisma";
import { reshapeUser } from "../../utils/reshape-user";

const includeTeacherAndHall = {
  teacher: { select: { email: true, username: true, fullName: true } },
  hall: {
    include: {
      room: { select: { name: true, number: true } },
      subject: {
        select: {
          Class: true,
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

  static getLectures = async (): Promise<Lecture[]> => {
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
}
