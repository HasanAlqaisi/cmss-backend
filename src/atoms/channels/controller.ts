import { Request, Response } from "express";
import {
  CreatedResponse,
  DeletedResponse,
  OkResponse,
} from "../../utils/api/api-response";
import ChannelService from "./service";
import * as validator from "./validator";
import * as generalValidator from "../../utils/general-validator";

export const getChannels = async (req: Request, res: Response) => {
  const channels = await ChannelService.getChannels();

  return new OkResponse(channels).send(res);
};

export const createChannel = async (req: Request, res: Response) => {
  const { name } = await validator.upsertChannel(req);

  const channel = await ChannelService.createChannel(name);

  return new CreatedResponse(channel).send(res);
};

export const deleteChannel = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);

  const idNumber = Number(id);

  await ChannelService.deleteChannel(idNumber);

  return new DeletedResponse("").send(res);
};

export const updateChannel = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);
  const { name } = await validator.upsertChannel(req);

  const idNumber = Number(id);

  const channel = await ChannelService.updateChannel(idNumber, name);

  return new OkResponse(channel).send(res);
};
