import _ from "lodash";
import ApplicantService from "../applicants/service";
import SpecialtyService from "../specialties/service";
import { FullApplicant } from "./types";

export const formatApplicantYear = (applicantYear: string) =>
  applicantYear.substring(applicantYear.indexOf("/") + 1, applicantYear.length);

export const computeAverage = async (applicant: FullApplicant) => {
  const queryCount = await SpecialtyService.calculateMaterialCountsForSpecialty(
    applicant.specialtyId
  );

  let totalDegree = 0.0;
  let addedDegrees = 0.0;

  applicant.degrees.forEach((degree) => {
    if (degree.material.customPercentage !== 0) {
      addedDegrees +=
        (degree.score * degree.material.customPercentage) /
        100 /
        queryCount[0].count;
    } else if (degree.score !== 0) {
      totalDegree += degree.score;
    }
  });

  let average = totalDegree / queryCount[0].count + addedDegrees;

  const applicantYear = formatApplicantYear(applicant.year.range);

  const currentYear = String(new Date().getFullYear());

  const shouldAddDaorOneDegree =
    applicantYear === currentYear && applicant.daor === 1;

  if (shouldAddDaorOneDegree) {
    average += 1;
  }

  await ApplicantService.updateTotalAndAvgForApplicant(
    applicant.id,
    average,
    totalDegree
  );
};
