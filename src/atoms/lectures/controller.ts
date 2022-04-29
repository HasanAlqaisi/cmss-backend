import { Request, Response } from "express";
import {
  CreatedResponse,
  DeletedResponse,
  OkResponse,
} from "../../utils/api/api-response";
import * as validator from "./validator";
import * as generalValidator from "../../utils/general-validator";
import LectureService from "./service";

export const getLectures = async (req: Request, res: Response) => {
  const { classId } = await validator.lectureQuery(req);

  let lectures;
  if (classId) {
    lectures = await LectureService.getLecturesForClass(Number(classId));
  } else {
    lectures = await LectureService.getLectures();
  }
  return new OkResponse(lectures).send(res);
};

export const createLecture = async (req: Request, res: Response) => {
  const { teacherId, roomId, subjectId } = await validator.createLecture(req);

  const lecture = await LectureService.createLecture(
    teacherId,
    roomId,
    subjectId
  );

  return new CreatedResponse(lecture).send(res);
};

export const deleteLecture = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);

  const idNumber = Number(id);

  await LectureService.deleteLecture(idNumber);

  return new DeletedResponse("").send(res);
};

export const updateLecture = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);
  const { teacherId, roomId, subjectId } = await validator.createLecture(req);

  const idNumber = Number(id);

  const subject = await LectureService.updateLecture(
    idNumber,
    teacherId,
    roomId,
    subjectId
  );

  return new OkResponse(subject).send(res);
};
