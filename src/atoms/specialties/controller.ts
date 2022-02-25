import { Request, Response } from "express";
import { DeletedResponse, OkResponse } from "../../utils/api/api-response";
import SpecialtyService from "./service";
import * as validator from "./validator";
import * as generalValidator from "../../utils/general-validator";

export const getSpecialties = async (req: Request, res: Response) => {
  const specialties = await SpecialtyService.getSpecialties();

  return new OkResponse(specialties).send(res);
};

export const createSpecialty = async (req: Request, res: Response) => {
  const { name, capacity } = await validator.upsertSpecialty(req);

  const specialty = await SpecialtyService.createSpecialty(name, capacity);

  return new OkResponse(specialty).send(res);
};

export const deleteSpecialty = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);

  const idNumber = Number(id);

  await SpecialtyService.deleteSpecialty(idNumber);

  return new DeletedResponse("").send(res);
};

export const updateSpecialty = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);
  const { name, capacity } = await validator.upsertSpecialty(req);

  const idNumber = Number(id);

  const specialty = await SpecialtyService.updateSpecialty(
    idNumber,
    name,
    capacity
  );

  return new OkResponse(specialty).send(res);
};
