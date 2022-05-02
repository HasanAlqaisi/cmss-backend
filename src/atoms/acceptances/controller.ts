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

  const applicants = await ApplicantService.getApplicants(channelIdNumber);

  // Save applicants of dependent branches in separate array
  const applicantsOfDependent: FullApplicant[] = [];

  // To know the number of accepted of each branch
  const acceptedCountBranches = new Map<number, number>();

  const countForEachBranch =
    await BranchService.countAcceptedApplicantsForEachBranch();

  countForEachBranch.forEach((branch) => {
    // eslint-disable-next-line no-underscore-dangle
    acceptedCountBranches.set(branch.id, branch._count.acceptedApplicants);
  });

  applicants.forEach((applicant) => {
    if (!applicant.average) {
      computeAverage(applicant);
    }

    for (let index = 0; index < applicant.selectedBranches.length; index++) {
      const selectedBranch = applicant.selectedBranches[index].branch;

      if (applicant.specialty.isDependent) {
        applicantsOfDependent.push(applicant);
        break;
      }

      if (
        selectedBranch.maxCapacity >
          acceptedCountBranches.get(selectedBranch.id)! &&
        applicant.average! >= applicant.specialty.minAvg
      ) {
        AcceptancesService.acceptApplicant(applicant.id, selectedBranch.id);

        const incrementAccepted =
          acceptedCountBranches.get(selectedBranch.id)! + 1;

        acceptedCountBranches.set(selectedBranch.id, incrementAccepted);
        break;
      }
    }
  });

  let acceptedCount = 0;
  acceptedCountBranches.forEach((count) => {
    acceptedCount += count;
  });

  applicantsOfDependent.forEach((applicant) => {
    for (let index = 0; index < applicant.selectedBranches.length; index++) {
      const selectedBranch = applicant.selectedBranches[index];
      const acceptCapacity = Math.trunc(
        (acceptedCount * applicant.specialty.customPercentage) / 100
      );

      if (
        selectedBranch.branch.maxCapacity >
          acceptedCountBranches.get(selectedBranch.id)! &&
        acceptCapacity > acceptedCountBranches.get(selectedBranch.id)!
      ) {
        AcceptancesService.acceptApplicant(applicant.id, selectedBranch.id);

        const incrementAccepted =
          acceptedCountBranches.get(selectedBranch.id)! + 1;

        acceptedCountBranches.set(selectedBranch.id, incrementAccepted);
        break;
      }
    }
  });

  return new OkResponse("The operation is completed successfully").send(res);
};
