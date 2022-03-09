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
          "فصل",
          `لقد تعدت غياباتك الحد المسموح في الدرس ${lec.name} وتم فصلك`,
          "الغيابات"
        );
      }
      if (lec.absence === absence.secondWarning) {
        sendEmail(
          result.email,
          "انذار ثاني",
          `لقد تعدت غياباتك الحد المسموح في الدرس ${lec.name}`,
          "الغيابات"
        );
      }
      if (lec.absence === absence.firstWarning) {
        sendEmail(
          result.email,
          "انذار اول",
          `لقد تعدت غياباتك الحد المسموح في الدرس ${lec.name}`,
          "الغيابات"
        );
      }
    });
  });

  return new OkResponse("emails sent successfuly").send(res);
};
