import { Request, Response } from "express";
import { OkResponse } from "../../utils/api/api-response";
import ReportService from "./service";
import * as validator from "./validator";
import { getEachStudentWithLecturesAbsences } from "./helpers";
import { FullReport } from "./types";
import AbsenceService from "../absences/service";
import sendEmail from "../../utils/send-email";

export const getReports = async (req: Request, res: Response) => {
  const { classId } = await validator.getReports(req);

  const warnings = await ReportService.getReports(classId);

  const results: FullReport[] = getEachStudentWithLecturesAbsences(warnings);

  return new OkResponse(results).send(res);
};

export const createReport = async (req: Request, res: Response) => {
  const { classId } = await validator.getReports(req);

  const operations = await Promise.all([
    ReportService.getReports(classId),
    AbsenceService.getAbsences(),
  ]);

  const warnings = operations[0];
  const absence = operations[1];

  const results: FullReport[] = getEachStudentWithLecturesAbsences(warnings);

  results.forEach((result) => {
    result.lectures.forEach((lec) => {
      if (lec.absence >= absence.thirdWarning) {
        sendEmail(
          result.email,
          "انذار ثالث",
          `مرحبا <strong>${result.name}</strong> .\n <br>لديك انذار غياب نهائي في مادة ال <strong>${lec.name}</strong>`,
          "انذار غياب ثالث"
        );
      }
      if (lec.absence === absence.secondWarning) {
        sendEmail(
          result.email,
          "انذار ثاني",
          `مرحبا <strong>${result.name}</strong> .\n <br>لديك انذار غياب ثانوي في مادة ال <strong>${lec.name}</strong>`,
          "انذار غياب ثاني"
        );
      }
      if (lec.absence === absence.firstWarning) {
        sendEmail(
          result.email,
          "انذار اول",
          `مرحبا <strong>${result.name}</strong> .\n <br>لديك انذار غياب اولي في مادة ال <strong>${lec.name}</strong>`,
          "انذار غياب اولي"
        );
      }
    });
  });

  return new OkResponse("emails sent successfuly").send(res);
};
