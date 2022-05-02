import { Request, Response } from "express";
import {
  CreatedResponse,
  DeletedResponse,
  OkResponse,
} from "../../utils/api/api-response";
import * as validator from "./validator";
import * as generalValidator from "../../utils/general-validator";
import RoleService from "./service";

export const getRoles = async (_: Request, res: Response) => {
  const roles = await RoleService.getRoles();

  return new OkResponse(roles).send(res);
};

export const createRole = async (req: Request, res: Response) => {
  const roleData = await validator.upsertRole(req);

  const role = await RoleService.createRole(roleData);

  return new CreatedResponse(role).send(res);
};

export const deleteRole = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);

  const idNumber = Number(id);

  await RoleService.deleteRole(idNumber);

  return new DeletedResponse("").send(res);
};

export const updateRole = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);
  const roleData = await validator.upsertRole(req);

  const idNumber = Number(id);

  const role = await RoleService.updateRole(idNumber, roleData);

  return new OkResponse(role).send(res);
};
