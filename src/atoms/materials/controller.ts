import { Request, Response } from "express";
import { Material } from "@prisma/client";
import { DeletedResponse, OkResponse } from "../../utils/api/api-response";
import * as validator from "./validator";
import * as generalValidator from "../../utils/general-validator";
import MaterialService from "./service";
import { reshapeData } from "../../utils/reshape-data";
import { MaterialsWithSpecialties } from "./types";

export const getMaterials = async (req: Request, res: Response) => {
  const { specialtyId } = await validator.getMaterials(req);

  const specialtyIdNumber = Number(specialtyId);

  const materials = await MaterialService.getMaterials(specialtyIdNumber);

  const reshapedMaterials = reshapeData(materials, [
    "specialtyId",
  ]) as MaterialsWithSpecialties;

  return new OkResponse(reshapedMaterials).send(res);
};

export const createMaterials = async (req: Request, res: Response) => {
  const {
    name,
    specialty_id: specialtyId,
    custom_percentage: customPercentage,
  } = await validator.upsertMaterial(req);

  const material = await MaterialService.createMaterial(
    name,
    specialtyId,
    customPercentage
  );

  const reshapedMaterial = reshapeData(material, ["specialtyId"]) as Material;

  return new OkResponse(reshapedMaterial).send(res);
};

export const deleteMaterial = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);

  const idNumber = Number(id);

  await MaterialService.deleteMaterial(idNumber);

  return new DeletedResponse("").send(res);
};

export const updateMaterial = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);
  const {
    name,
    specialty_id: specialtyId,
    custom_percentage: customPercentage,
  } = await validator.upsertMaterial(req);

  const idNumber = Number(id);

  const material = await MaterialService.updateMaterial(
    idNumber,
    name,
    specialtyId,
    customPercentage
  );

  const reshapedMaterial = reshapeData(material, ["specialtyId"]) as Material;

  return new OkResponse(reshapedMaterial).send(res);
};
