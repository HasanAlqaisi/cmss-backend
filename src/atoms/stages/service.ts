import { Stage } from "@prisma/client";
import prisma from "../../prisma";

export default class StageService {
  static getStages = async () => {
    const stages = await prisma.stage.findMany();
    return stages;
  };

  static updateStage = async (
    id: number,
    forbiddenDays: number[]
  ): Promise<Stage> => {
    const stage = await prisma.stage.update({
      where: { id },
      data: { forbiddenDays },
    });
    return stage;
  };
}
