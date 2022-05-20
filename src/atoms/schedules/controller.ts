import { Request, Response } from "express";
import * as Converter from "json-2-csv";
import { CreatedResponse, OkResponse } from "../../utils/api/api-response";
import { reshapeTimetable } from "./helpers";
import ScheduleService from "./service";
import * as validator from "./validator";

export const createSchedule = async (_: Request, res: Response) => {
  const result = await ScheduleService.createSchedule();

  const timetable = reshapeTimetable(result.schedules);

  return new CreatedResponse({ conflicts: result.conflicts, timetable }).send(
    res
  );
};

export const getSchedules = async (req: Request, res: Response) => {
  const { programId } = await validator.getSchedules(req);

  let result;
  if (programId) {
    result = await ScheduleService.getSchedulesForProgram(Number(programId));
  } else {
    result = await ScheduleService.getSchedules();
  }
  const timetable = reshapeTimetable(result);

  return new OkResponse(timetable).send(res);
};

export const convertScheduleToXls = async (_: Request, res: Response) => {
  const result = await ScheduleService.getSchedules();

  const timetable = reshapeTimetable(result);

  const csv = await Converter.json2csvAsync(timetable);

  res.set("Content-Type", "text/csv");
  res.set("Content-Disposition", 'attachment; filename="schedule.csv"');

  res.send(csv);
};
