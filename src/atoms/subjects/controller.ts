import { Subject } from "@prisma/client";
import { Request, Response } from "express";
import {
  CreatedResponse,
  DeletedResponse,
  OkResponse,
} from "../../utils/api/api-response";
import SubjectService from "./service";
import * as validator from "./validator";
import * as generalValidator from "../../utils/general-validator";

export const getSubjects = async (req: Request, res: Response) => {
  const { classId } = await validator.getSubjects(req);
  let subjects: Subject[];

  if (classId) {
    subjects = await SubjectService.getSubjectsForClass(Number(classId));
  } else {
    subjects = await SubjectService.getSubjects();
  }

  return new OkResponse(subjects).send(res);
};

export const createSubject = async (req: Request, res: Response) => {
  const { name, classId, isElectronic, isLab } = await validator.createSubject(
    req
  );

  const subject = await SubjectService.createSubject(
    classId,
    name,
    isElectronic,
    isLab
  );

  return new CreatedResponse(subject).send(res);
};

export const deleteSubject = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);

  const idNumber = Number(id);

  await SubjectService.deleteSubject(idNumber);

  return new DeletedResponse("").send(res);
};

export const updateSubject = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);
  const { name, isElectronic, isLab, classId } = await validator.updateSubject(
    req
  );

  const idNumber = Number(id);

  const subject = await SubjectService.updateSubject(
    idNumber,
    classId,
    name,
    isElectronic,
    isLab
  );

  return new OkResponse(subject).send(res);
};
