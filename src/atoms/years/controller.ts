import { Request, Response } from "express";
import { OkResponse } from "../../utils/api/api-response";
import YearService from "./service";

// eslint-disable-next-line import/prefer-default-export
export const getYears = async (_: Request, res: Response) => {
  const years = await YearService.getYears();

  return new OkResponse(years).send(res);
};
