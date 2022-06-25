import { Request, Response } from "express";
import _ from "lodash";
import { OkResponse } from "../../utils/api/api-response";
import AcceptancesService from "./service";
import { FullApplicant } from "./types";
import BranchService from "../branches/service";
import ApplicantService from "../applicants/service";
import * as validator from "./validator";
import { computeAverage } from "./helpers";

// eslint-disable-next-line import/prefer-default-export
export const computeAcceptances = async (req: Request, res: Response) => {
  const { channelId } = await validator.computeAcceptances(req);

  const channelIdNumber = Number(channelId);

  let applicants = await ApplicantService.getApplicants(channelIdNumber);

  // Save applicants of dependent branches in separate array
  const applicantsOfDependent: FullApplicant[] = [];

  // To know the number of accepted dependent applicants of each branch
  const acceptedCountDependentApplicants = new Map<number, number>();

  // To know the total number of accepted of each branch
  const acceptedCountBranches = new Map<number, number>();

  const countForEachBranch =
    await BranchService.countAcceptedApplicantsForEachBranch();

  countForEachBranch.forEach((branch) => {
    // eslint-disable-next-line no-underscore-dangle
    acceptedCountBranches.set(branch.id, branch._count.acceptedApplicants);
  });

  // eslint-disable-next-line no-restricted-syntax
  for (const applicant of applicants) {
    let totalDegrees = 0;

    applicant.degrees.forEach((degree) => {
      totalDegrees += degree.score;
    });

    if (totalDegrees !== 0) {
      // eslint-disable-next-line no-await-in-loop
      await computeAverage(applicant);
    }
  }

  applicants = await ApplicantService.getApplicants(channelIdNumber);

  // eslint-disable-next-line no-restricted-syntax
  for (const applicant of applicants) {
    for (let j = 0; j < applicant.selectedBranches.length; j++) {
      const selectedBranch = applicant.selectedBranches[j].branch;

      if (applicant.specialty.isDependent) {
        applicantsOfDependent.push(applicant);
        break;
      }

      if (
        selectedBranch.maxCapacity >
          acceptedCountBranches.get(selectedBranch.id)! &&
        applicant.average?.toNumber()! >= applicant.specialty.minAvg
      ) {
        // eslint-disable-next-line no-await-in-loop
        await AcceptancesService.acceptApplicant(
          applicant.id,
          selectedBranch.id
        );

        const incrementAccepted =
          acceptedCountBranches.get(selectedBranch.id)! + 1;

        acceptedCountBranches.set(selectedBranch.id, incrementAccepted);
        break;
      }
    }
  }

  let acceptedCount = 0;
  acceptedCountBranches.forEach((count) => {
    acceptedCount += count;
  });

  // eslint-disable-next-line no-restricted-syntax
  for (const applicant of applicants) {
    for (let index = 0; index < applicant.selectedBranches.length; index++) {
      const selectedBranch = applicant.selectedBranches[index];
      const acceptCapacity = Math.trunc(
        (acceptedCount * applicant.specialty.customPercentage) / 100
      );

      if (
        selectedBranch.branch.maxCapacity >
          acceptedCountBranches.get(selectedBranch.id)! &&
        acceptCapacity >
          acceptedCountDependentApplicants.get(selectedBranch.id)! &&
        applicant.average?.toNumber()! >= applicant.specialty.minAvg
      ) {
        // eslint-disable-next-line no-await-in-loop
        await AcceptancesService.acceptApplicant(
          applicant.id,
          selectedBranch.id
        );

        let incrementAccepted =
          acceptedCountBranches.get(selectedBranch.id)! + 1;

        acceptedCountBranches.set(selectedBranch.id, incrementAccepted);

        incrementAccepted =
          acceptedCountDependentApplicants.get(selectedBranch.id)! + 1;

        acceptedCountDependentApplicants.set(
          selectedBranch.id,
          incrementAccepted
        );

        break;
      }
    }
  }

  return new OkResponse("The operation is completed successfully").send(res);
};
