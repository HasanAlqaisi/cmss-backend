import { Class } from "@prisma/client";
import prisma from "../../prisma";

export default class ClassService {
  static getClasses = async (): Promise<Class[]> => {
    const classes = await prisma.class.findMany({
      include: { branch: true, program: true, stage: true },
    });
    return classes;
  };
}
