import { Request, Response } from "express";
import { OkResponse } from "../../utils/api/api-response";
import ScheduleService from "./service";
import * as validator from "./validator";

export const createSchedule = async (req: Request, res: Response) => {
  const schedule = await ScheduleService.createSchedule();

  return new OkResponse(schedule).send(res);
};

export const getSchedules = async (req: Request, res: Response) => {
  const { programId } = await validator.getSchedules(req);

  let schedules;
  if (programId) {
    schedules = await ScheduleService.getSchedulesForProgram(Number(programId));
  } else {
    schedules = await ScheduleService.getSchedules();
  }

  return new OkResponse(schedules).send(res);
};
