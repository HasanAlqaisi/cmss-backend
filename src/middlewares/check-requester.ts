import { Request, Response, NextFunction } from "express";
import UserService from "../atoms/users/service";
import { UserWithPermissions } from "../atoms/users/types";
import { ForbiddenError } from "../utils/api/api-error";
import logger from "../utils/config/logger";
import getIdFromPayload from "../utils/get-id-from-payload";

export default async (req: Request, res: Response, next: NextFunction) => {
  const requesterId = getIdFromPayload(req.headers.authorization!);

  const user = await UserService.findById(requesterId);

  const userRequester = req.user as UserWithPermissions;

  if (userRequester.role.name !== "root" && req.user !== user) {
    throw new ForbiddenError();
  }

  return next();
};
