import { Request, Response } from "express";
import { OkResponse } from "../../utils/api/api-response";
import ScheduleService from "./service";

// eslint-disable-next-line import/prefer-default-export
export const createSchedule = async (req: Request, res: Response) => {
  const schedule = await ScheduleService.createSchedule();

  return new OkResponse(schedule).send(res);
};
