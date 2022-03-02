// import { ForbiddenError } from "@casl/ability";
import { ForbiddenError as CaslError } from "@casl/ability";
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import multer from "multer";
import {
  ApiError,
  BadRequestError,
  BadTokenError,
  ForbiddenError,
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

  if (err instanceof CaslError) {
    return ApiError.handle(new ForbiddenError(err.message), res);
  }

  if (err instanceof multer.MulterError) {
    return ApiError.handle(new BadRequestError(err), res);
  }

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
    return ApiError.handle(new BadRequestError(err), res);
  }

  return ApiError.handle(new InternalError(err.message), res);
};
