import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { ForbiddenError } from "@casl/ability";
import perm from "../utils/permissions";
import { UserWithPermissions } from "../atoms/users/types";

export default (action: string, subject: Prisma.ModelName) =>
  (req: Request, _: Response, next: NextFunction) => {
    const ability = perm(req.user as UserWithPermissions);

    ForbiddenError.from(ability).throwUnlessCan(action, subject);

    return next();
  };
