import { Subject } from "@prisma/client";
import prisma from "../../prisma";

export default class SubjectService {
  static getSubjects = async (): Promise<Subject[]> => {
    const subjects = await prisma.subject.findMany({
      include: {
        Class: { include: { branch: true, program: true, stage: true } },
      },
    });
    return subjects;
  };

  static getSubjectsForClass = async (classId: number): Promise<Subject[]> => {
    const subjects = await prisma.subject.findMany({
      where: { classId },
      include: {
        Class: { include: { branch: true, program: true, stage: true } },
      },
    });
    return subjects;
  };

  static createSubject = async (
    classId: number,
    name: string,
    isElectronic: boolean,
    isLab: boolean
  ): Promise<Subject> => {
    const subject = await prisma.subject.create({
      include: {
        Class: { include: { branch: true, program: true, stage: true } },
      },
      data: {
        classId,
        name,
        isElectronic,
        isLab,
      },
    });

    return subject;
  };

  static deleteSubject = async (id: number): Promise<void> => {
    await prisma.subject.delete({ where: { id } });
  };

  static updateSubject = async (
    id: number,
    classId: number,
    name: string,
    isElectronic: boolean,
    isLab: boolean
  ): Promise<Subject> => {
    const subject = await prisma.subject.update({
      where: { id },
      include: {
        Class: { include: { branch: true, program: true, stage: true } },
      },
      data: { classId, name, isElectronic, isLab },
    });

    return subject;
  };
}
