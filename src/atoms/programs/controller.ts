import { Request, Response } from "express";
import { OkResponse } from "../../utils/api/api-response";
import ProgramService from "./service";

// eslint-disable-next-line import/prefer-default-export
export const getPrograms = async (req: Request, res: Response) => {
  const programs = await ProgramService.getPrograms();

  return new OkResponse(programs).send(res);
};
