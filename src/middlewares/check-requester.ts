import { Request, Response, NextFunction } from "express";
import UserService from "../atoms/users/service";
import { ForbiddenError } from "../utils/api/api-error";
import getIdFromPayload from "../utils/get-id-from-payload";

export default async (req: Request, res: Response, next: NextFunction) => {
  const requesterId = getIdFromPayload(req.params.id);

  const user = await UserService.findById(requesterId);

  if (req.user !== user) {
    throw new ForbiddenError();
  }

  return next();
};
