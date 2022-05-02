// import { ForbiddenError } from "@casl/ability";
import { ForbiddenError as CaslError } from "@casl/ability";
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import multer from "multer";
import {
  ApiError,
  BadRequestError,
  ForbiddenError,
  InternalError,
} from "./api/api-error";
import logger from "./config/logger";

export default (err: any, req: Request, res: Response, _next: NextFunction) => {
  logger.error(JSON.stringify(err));

  if (err instanceof ApiError) return ApiError.handle(err, req, res);

  if (err instanceof CaslError) {
    return ApiError.handle(new ForbiddenError(err.message), req, res);
  }

  if (err instanceof multer.MulterError) {
    return ApiError.handle(new BadRequestError(err), req, res);
  }

  // Checking for unique constraints
  if (err.code === "P2002")
    return ApiError.handle(
      new BadRequestError(`${err.meta.target[0]} is already exists`),
      req,
      res
    );

  if (err.code === "P2003")
    return ApiError.handle(
      new BadRequestError(`one of provided ids does not exist`),
      req,
      res
    );

  if (err.code === "P2025") {
    return ApiError.handle(new BadRequestError(err.meta.cause), req, res);
  }

  if (err instanceof ZodError) {
    return ApiError.handle(new BadRequestError(err), req, res);
  }

  return ApiError.handle(new InternalError(err.message), req, res);
};
