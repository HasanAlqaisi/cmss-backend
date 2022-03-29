import { Subject } from "@prisma/client";
import prisma from "../../prisma";

export default class SubjectService {
  static getSubjects = async (): Promise<Subject[]> => {
    const subjects = await prisma.subject.findMany();
    return subjects;
  };

  static getSubjectsForClass = async (classId: number): Promise<Subject[]> => {
    const subjects = await prisma.subject.findMany({ where: { classId } });
    return subjects;
  };

  static createSubject = async (
    classId: number,
    name: string,
    isElectronic: boolean,
    isLab: boolean
  ): Promise<Subject> => {
    const subject = await prisma.subject.create({
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
      data: { classId, name, isElectronic, isLab },
    });

    return subject;
  };
}
