import prisma from "../../prisma";
import { InputStudent } from "./types";

export default class StudentService {
  static getStudents = async () => {
    const students = await prisma.student.findMany({
      include: { Class: true, channel: true, year: true },
    });
    return students;
  };

  static getStudentsForClass = async (classId: number) => {
    const students = await prisma.student.findMany({
      where: { Class: { id: classId } },
      include: { Class: true, channel: true, year: true },
    });
    return students;
  };

  static createStudent = async (input: InputStudent) => {
    const student = await prisma.student.create({
      data: {
        name: input.name,
        age: input.age,
        gender: input.gender,
        email: input.email,
        year: {
          connectOrCreate: {
            where: { range: input.highSchoolYearRange },
            create: { range: input.highSchoolYearRange },
          },
        },
        channel: { connect: { id: input.channelId } },
        Class: { connect: { id: input.classId } },
      },
      include: { Class: true, channel: true, year: true },
    });

    return student;
  };

  static deleteStudent = async (id: number): Promise<void> => {
    await prisma.student.delete({ where: { id } });
  };

  static updateStudent = async (id: number, input: InputStudent) => {
    const student = await prisma.student.update({
      where: { id },
      data: {
        name: input.name,
        age: input.age,
        gender: input.gender,
        email: input.email,
        year: {
          connectOrCreate: {
            where: { range: input.highSchoolYearRange },
            create: { range: input.highSchoolYearRange },
          },
        },
        channel: { connect: { id: input.channelId } },
        Class: { connect: { id: input.classId } },
      },
      include: { Class: true, channel: true, year: true },
    });

    return student;
  };
}
