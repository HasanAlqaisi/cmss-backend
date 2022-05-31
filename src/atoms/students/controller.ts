import { Request, Response } from "express";
import {
  CreatedResponse,
  DeletedResponse,
  OkResponse,
} from "../../utils/api/api-response";
import StudentService from "./service";
import * as validator from "./validator";
import * as generalValidator from "../../utils/general-validator";
import AttendanceService from "../attendances/service";
import { reshapeStudentsWithAttendances } from "./helpers";

export const getStudents = async (req: Request, res: Response) => {
  const { classId, lectureId } = await validator.studentQuery(req);

  let students;
  if (classId && lectureId) {
    const attendances = await AttendanceService.getAttendances(
      Number(lectureId)
    );

    students = await StudentService.getStudentsForClass(Number(classId));

    students = reshapeStudentsWithAttendances(attendances, students);
  } else {
    students = await StudentService.getStudents();
  }
  return new OkResponse(students).send(res);
};

export const createStudent = async (req: Request, res: Response) => {
  const input = await validator.upsertStudent(req);

  const student = await StudentService.createStudent(input);

  return new CreatedResponse(student).send(res);
};

export const deleteStudent = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);

  const idNumber = Number(id);

  await StudentService.deleteStudent(idNumber);

  return new DeletedResponse("").send(res);
};

export const updateStudent = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);
  const input = await validator.upsertStudent(req);

  const idNumber = Number(id);

  const student = await StudentService.updateStudent(idNumber, input);

  return new OkResponse(student).send(res);
};
