import { Request, Response } from "express";
import { DeletedResponse, OkResponse } from "../../utils/api/api-response";
import CategoryService from "./service";
import * as validator from "./validator";
import * as generalValidator from "../../utils/general-validator";

export const getCategories = async (_: Request, res: Response) => {
  const categories = await CategoryService.getCategories();

  return new OkResponse(categories).send(res);
};

export const createCategory = async (req: Request, res: Response) => {
  const { name } = await validator.upsertCategory(req);

  const category = await CategoryService.createCategory(name);

  return new OkResponse(category).send(res);
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);

  const idNumber = Number(id);

  await CategoryService.deleteCategory(idNumber);

  return new DeletedResponse("").send(res);
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);
  const { name } = await validator.upsertCategory(req);

  const idNumber = Number(id);

  const channel = await CategoryService.updateCategory(idNumber, name);

  return new OkResponse(channel).send(res);
};
