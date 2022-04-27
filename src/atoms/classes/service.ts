import { Class } from "@prisma/client";
import prisma from "../../prisma";
import { Input } from "./types";

export default class ClassService {
  static getClasses = async (): Promise<Class[]> => {
    const classes = await prisma.class.findMany({
      include: { branch: true, program: true, stage: true },
    });
    return classes;
  };

  static createClass = async (input: Input) => {
    const klass = await prisma.class.create({
      data: {
        stage: { connect: { id: input.stageId } },
        branch: { connect: { id: input.branchId } },
        program: { connect: { id: input.programId } },
      },
      include: { branch: true, program: true, stage: true },
    });
    return klass;
  };

  static deleteClass = async (id: number) => {
    await prisma.class.delete({
      where: { id },
    });
  };
}
