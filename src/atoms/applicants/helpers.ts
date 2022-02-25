import _ from "lodash";
import { InputApplicant } from "./types";

// eslint-disable-next-line import/prefer-default-export
export const reshapeDegreesForUpdate = (inputApplicant: InputApplicant) =>
  _.map(inputApplicant.degrees, (degree) => ({
    material: { connect: { id: degree.materialId } },
    score: degree.score,
  }));

export const reshapeBranches = (selectedBranches: number[]) =>
  _.map(selectedBranches, (branchId, index) => ({
    branch: { connect: { id: branchId } },
    priority: index + 1,
  }));
