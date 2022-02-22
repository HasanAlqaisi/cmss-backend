import { Request, Response } from "express";
import writeChromosomesToFile from "../../algorithms/genetic-algorithm/write-chromosomes-to-file";
import { OkResponse } from "../../utils/api/api-response";
import ScheduleService from "./service";

// eslint-disable-next-line import/prefer-default-export
export const createSchedule = async (req: Request, res: Response) => {
  const schedule = await ScheduleService.createSchedule();

  writeChromosomesToFile("./schedule.json", schedule);

  return new OkResponse(schedule).send(res);
};
