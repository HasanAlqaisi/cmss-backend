import { Class } from "@prisma/client";
import { Request, Response } from "express";
import { DeletedResponse, OkResponse } from "../../utils/api/api-response";
import { reshapeData } from "../../utils/reshape-data";
import ClassService from "./service";

// eslint-disable-next-line import/prefer-default-export
export const getClasses = async (req: Request, res: Response) => {
  const classes = await ClassService.getClasses();

  const reshapedClasses = reshapeData(classes, [
    "branchId",
    "programId",
    "stageId",
  ]) as Class[];

  return new OkResponse(reshapedClasses).send(res);
};
