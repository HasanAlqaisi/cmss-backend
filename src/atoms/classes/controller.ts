import { Class } from "@prisma/client";
import { Request, Response } from "express";
import { DeletedResponse, OkResponse } from "../../utils/api/api-response";
import { reshapeData } from "../../utils/reshape-data";
import ClassService from "./service";
import * as validator from "./validator";

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

export const createClass = async (req: Request, res: Response) => {
  const input = await validator.insertClass(req);

  const klass = await ClassService.createClass(input);

  const reshapedClass = reshapeData(klass, [
    "branchId",
    "programId",
    "stageId",
  ]) as Class;

  return new OkResponse(reshapedClass).send(res);
};

export const deleteClass = async (req: Request, res: Response) => {
  const { classId } = await validator.deleteClass(req);

  await ClassService.deleteClass(classId);

  return new DeletedResponse("").send(res);
};
