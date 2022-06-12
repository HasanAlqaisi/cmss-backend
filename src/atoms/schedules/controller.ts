import { Request, Response } from "express";
import * as Converter from "json-2-csv";
import AdmZip from "adm-zip";
import { CreatedResponse, OkResponse } from "../../utils/api/api-response";
import { reshapeTimetable, reshapeTimetableForCsv } from "./helpers";
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

  // Format schedule to appropriate CSV shape
  const reshapedTimetables = reshapeTimetableForCsv(reshapeTimetable(result));

  // Init zip process
  const zip = new AdmZip();

  const filesZipping = reshapedTimetables.map(async (timetable) => {
    // Convert json schedule to CSV
    const file = await Converter.json2csvAsync(timetable.schedule, {
      expandArrayObjects: true,
    });
    // Add file to zip.
    zip.addFile(`${timetable.title}.csv`, Buffer.from(file));
  });

  await Promise.all(filesZipping);

  const zipFileContents = zip.toBuffer();
  const fileName = "schedules.zip";
  const fileType = "application/zip";
  res.writeHead(200, {
    "Content-Disposition": `attachment; filename="${fileName}"`,
    "Content-Type": fileType,
  });
  return res.end(zipFileContents);
};
