import prisma from "../../prisma";

export default class ProgramService {
  static getPrograms = async () => {
    const program = await prisma.program.findMany();
    return program;
  };
}
