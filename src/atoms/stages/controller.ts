import { Request, Response } from "express";
import { DeletedResponse, OkResponse } from "../../utils/api/api-response";
import StageService from "./service";
import * as validator from "./validator";
import * as generalValidator from "../../utils/general-validator";

export const getStages = async (req: Request, res: Response) => {
  const stages = await StageService.getStages();

  return new OkResponse(stages).send(res);
};

export const updateStage = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);
  const { forbiddenDays } = await validator.updateStage(req);

  const idNumber = Number(id);

  const stage = await StageService.updateStage(idNumber, forbiddenDays);

  return new OkResponse(stage).send(res);
};
