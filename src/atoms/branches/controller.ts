import { Request, Response } from "express";
import {
  CreatedResponse,
  DeletedResponse,
  OkResponse,
} from "../../utils/api/api-response";
import BranchService from "./service";
import * as validator from "./validator";
import * as generalValidator from "../../utils/general-validator";

export const getbranches = async (_: Request, res: Response) => {
  const branches = await BranchService.getBranches();

  return new OkResponse(branches).send(res);
};

export const createBranch = async (req: Request, res: Response) => {
  const { name, maxCapacity } = await validator.upsertBranch(req);

  const branch = await BranchService.createBranch(name, maxCapacity);

  return new CreatedResponse(branch).send(res);
};

export const deleteBranch = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);

  const idNumber = Number(id);

  await BranchService.deleteBranch(idNumber);

  return new DeletedResponse("").send(res);
};

export const updateBranch = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);
  const { name, maxCapacity } = await validator.upsertBranch(req);

  const idNumber = Number(id);

  const branch = await BranchService.updateBranch(idNumber, name, maxCapacity);

  return new OkResponse(branch).send(res);
};
