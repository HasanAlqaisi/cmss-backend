import { Request, Response } from "express";
import { OkResponse } from "../../utils/api/api-response";
import WarningService from "./service";
import * as validator from "./validator";
import { getEachStudentWithLecturesAbsences } from "./helpers";
import { FullWarning } from "./types";
import AbsenceService from "../absences/service";
import sendEmail from "../../utils/send-email";

// eslint-disable-next-line import/prefer-default-export
export const getWarnings = async (req: Request, res: Response) => {
  const { classId } = await validator.getWarnings(req);

  const warnings = await WarningService.getWarnings(classId);

  const results: FullWarning[] = getEachStudentWithLecturesAbsences(warnings);

  return new OkResponse(results).send(res);
};

export const createWarning = async (req: Request, res: Response) => {
  const { classId } = await validator.getWarnings(req);

  const operations = await Promise.all([
    WarningService.getWarnings(classId),
    AbsenceService.getAbsences(),
  ]);

  const warnings = operations[0];
  const absence = operations[1];

  const results: FullWarning[] = getEachStudentWithLecturesAbsences(warnings);

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
