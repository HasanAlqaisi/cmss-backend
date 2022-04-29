import { Request, Response } from "express";
import { CreatedResponse, DeletedResponse, OkResponse } from "../../utils/api/api-response";
import * as validator from "./validator";
import * as generalValidator from "../../utils/general-validator";
import RoomService from "./service";

export const getRooms = async (_: Request, res: Response) => {
  const rooms = await RoomService.getRooms();

  return new OkResponse(rooms).send(res);
};

export const createRoom = async (req: Request, res: Response) => {
  const { number, name } = await validator.createRoom(req);

  const room = await RoomService.createRoom(number, name);

  return new CreatedResponse(room).send(res);
};

export const deleteRoom = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);

  const idNumber = Number(id);

  await RoomService.deleteRoom(idNumber);

  return new DeletedResponse("").send(res);
};

export const updateRoom = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);
  const { number, name } = await validator.updateRoom(req);

  const idNumber = Number(id);

  const room = await RoomService.updateRoom(idNumber, number, name);

  return new OkResponse(room).send(res);
};
