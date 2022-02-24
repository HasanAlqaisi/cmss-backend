// import { ForbiddenError } from "@casl/ability";
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import {
  ApiError,
  BadRequestError,
  BadTokenError,
  InternalError,
} from "./api/api-error";
import logger from "./config/logger";

export default (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(JSON.stringify(err));

  if (err instanceof ApiError) return ApiError.handle(err, res);

  //   if (err instanceof ForbiddenError) {
  //     return ApiError.handle(new BadTokenError(err.message), res);
  //   }

  // Checking for unique constraints
  if (err.code === "P2002")
    return ApiError.handle(
      new BadRequestError(`${err.meta.target[0]} is already exists`),
      res
    );

  if (err.code === "P2003")
    return ApiError.handle(
      new BadRequestError(`one of provided ids does not exist`),
      res
    );

  if (err.code === "P2025") {
    return ApiError.handle(new BadRequestError(err.meta.cause), res);
  }

  if (err instanceof ZodError) {
    const formattedError = {
      errors: {},
    };

    const keys = err.issues.map((issue) => issue.path[0]);
    const messages = err.issues.map((issue) => issue.message);

    keys.forEach((key, index) => {
      (formattedError as any).errors[key] = messages[index];
    });

    return ApiError.handle(new BadRequestError(formattedError), res);
  }

  return ApiError.handle(new InternalError(err.message), res);
};
