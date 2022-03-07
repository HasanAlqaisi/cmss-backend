import { Request, Response } from "express";
import { DeletedResponse, OkResponse } from "../../utils/api/api-response";
import AttendanceService from "./service";
import * as validator from "./validator";
import * as generalValidator from "../../utils/general-validator";

export const getAttendances = async (req: Request, res: Response) => {
  const query = await validator.getAttendances(req);

  const attendances = await AttendanceService.getAttendances(
    query.lectureId,
    query.studentId,
    query.date
  );

  return new OkResponse(attendances).send(res);
};

export const createAttendance = async (req: Request, res: Response) => {
  const input = await validator.upsertAttendance(req);

  const attendance = await AttendanceService.createAttendance(input);

  return new OkResponse(attendance).send(res);
};

export const deleteAttendance = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);

  const idNumber = Number(id);

  await AttendanceService.deleteAttendance(idNumber);

  return new DeletedResponse("").send(res);
};

export const updateAttendance = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);
  const input = await validator.upsertAttendance(req);

  const idNumber = Number(id);

  const attendance = await AttendanceService.updateAttendance(idNumber, input);

  return new OkResponse(attendance).send(res);
};
