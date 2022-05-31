import { Request, Response } from "express";
import {
  CreatedResponse,
  DeletedResponse,
  OkResponse,
} from "../../utils/api/api-response";
import AttendanceService from "./service";
import * as validator from "./validator";
import * as generalValidator from "../../utils/general-validator";
import { UserWithPermissions } from "../users/types";
import { ForbiddenError, NotFoundError } from "../../utils/api/api-error";
import { canTeacherManageAttendance } from "./helpers";
import StudentService from "../students/service";

export const getAttendances = async (req: Request, res: Response) => {
  const query = await validator.getAttendances(req);

  const attendances = await AttendanceService.getAttendances(
    query.lectureId,
    query.studentId,
    query.date
  );

  return new OkResponse(attendances).send(res);
};

export const startAttendanceSession = async (req: Request, res: Response) => {
  const input = await validator.startSessionAttendance(req);

  if (await canTeacherManageAttendance(req, input.lectureId)) {
  const studentsClass = await StudentService.getStudentsForClass(input.classId);

  const studentsIds = studentsClass.map((student) => student.id);

  await AttendanceService.createAttendances(input.lectureId, studentsIds);

  return new CreatedResponse("Session started successfully").send(res);
  }

  throw new ForbiddenError();
};

export const deleteAttendance = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);

  const idNumber = Number(id);

  const attendance = await AttendanceService.getAttendance(idNumber);

  if (!attendance) {
    throw new NotFoundError();
  }

  if ((req.user as UserWithPermissions).id === attendance.lecture.teacherId) {
    await AttendanceService.deleteAttendance(idNumber);
  } else {
    throw new ForbiddenError();
  }

  return new DeletedResponse("").send(res);
};

export const updateAttendance = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);
  const input = await validator.upsertAttendance(req);

  const idNumber = Number(id);

  if (await canTeacherManageAttendance(req, input.lectureId)) {
    const attendance = await AttendanceService.updateAttendance(
      idNumber,
      input
    );

    return new OkResponse(attendance).send(res);
  }

  throw new ForbiddenError();
};

export const toggleAttendance = async (req: Request, res: Response) => {
  const input = await validator.toggleAttendance(req);

  if (await canTeacherManageAttendance(req, input.lectureId)) {
  const currentAttendance = await AttendanceService.getAttendance(undefined, {
    lectureId: input.lectureId,
    studentId: input.studentId,
    date: input.date || new Date(),
  });

  const updatedAttendance = await AttendanceService.toggleAttendance(
    input,
    currentAttendance?.attended || false
  );

  return new CreatedResponse(updatedAttendance).send(res);
  }

  throw new ForbiddenError();
};
