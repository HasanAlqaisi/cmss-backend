import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import zodErrorMapper from "../utils/zod-error-mapper";

const setZodErrors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const em: z.ZodErrorMap = (issue, ctx) => zodErrorMapper(issue, ctx, req);

  z.setErrorMap(em);

  return next();
};

export default setZodErrors;
