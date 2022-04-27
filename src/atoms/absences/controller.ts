import { Request, Response } from "express";
import { OkResponse } from "../../utils/api/api-response";
import AbsenceService from "./service";
import * as validator from "./validator";
import * as generalValidator from "../../utils/general-validator";

export const getAbsences = async (_: Request, res: Response) => {
  const absences = await AbsenceService.getAbsences();

  return new OkResponse(absences).send(res);
};

export const updateAbsence = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);
  const input = await validator.updateAbsence(req);

  const idNumber = Number(id);

  const absence = await AbsenceService.updateAbsence(idNumber, input);

  return new OkResponse(absence).send(res);
};
