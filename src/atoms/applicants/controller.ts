import { Request, Response } from "express";
import _ from "lodash";
import { Applicant } from "@prisma/client";
import {
  CreatedResponse,
  DeletedResponse,
  OkResponse,
} from "../../utils/api/api-response";
import ApplicantService from "./service";
import * as validator from "./validator";
import * as generalValidator from "../../utils/general-validator";
import { reshapeData } from "../../utils/reshape-data";
import { reshapeBranches } from "./helpers";
import { NotFoundError } from "../../utils/api/api-error";

export const getApplicants = async (req: Request, res: Response) => {
  const { channelId, name } = await validator.getApplicants(req);

  const idChannelNumber = Number(channelId);

  const applicants = await ApplicantService.getApplicants(
    idChannelNumber,
    name
  );

  const reshapedApplicants = reshapeData(applicants, [
    "highSchoolYearId",
    "specialtyId",
    "channelId",
  ]) as Applicant[];

  return new OkResponse(reshapedApplicants).send(res);
};

export const getApplicant = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);

  const idNumber = Number(id);

  const applicant = await ApplicantService.getApplicant(idNumber);

  if (applicant) {
    const reshapedApplicant = reshapeData(applicant, [
      "highSchoolYearId",
      "specialtyId",
      "channelId",
    ]) as Applicant;

    return new OkResponse(reshapedApplicant).send(res);
  }

  throw new NotFoundError("Applicant not found");
};

export const createApplicant = async (req: Request, res: Response) => {
  const inputApplicant = await validator.upsertApplicant(req);

  const branches = _.map(
    inputApplicant.selectedBranches,
    (branchId, index) => ({
      branch: { connect: { id: branchId } },
      priority: index + 1,
    })
  );

  const applicant = await ApplicantService.createApplicant(
    inputApplicant,
    branches
  );

  const reshapedApplicant = reshapeData(applicant, [
    "highSchoolYearId",
    "specialtyId",
    "channelId",
  ]) as Applicant;

  return new CreatedResponse(reshapedApplicant).send(res);
};

export const deleteApplicant = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);

  const idNumber = Number(id);

  await ApplicantService.deleteApplicant(idNumber);

  return new DeletedResponse("").send(res);
};

export const deleteApplicants = async (req: Request, res: Response) => {
  const { channelId } = await validator.deleteApplicants(req);

  const idNumber = Number(channelId);

  if (idNumber) {
    await ApplicantService.deleteApplicantsForChannel(idNumber);
  } else {
    await ApplicantService.deleteApplicants();
  }

  return new DeletedResponse("").send(res);
};

export const updateApplicant = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);

  const inputApplicant = await validator.upsertApplicant(req);

  const branches = reshapeBranches(inputApplicant.selectedBranches);

  const idNumber = Number(id);

  const applicant = await ApplicantService.updateApplicant(
    idNumber,
    inputApplicant,
    branches
  );

  const reshapedApplicant = reshapeData(applicant, [
    "highSchoolYearId",
    "specialtyId",
    "channelId",
  ]) as Applicant;

  return new OkResponse(reshapedApplicant).send(res);
};
