import { Request, Response } from "express";
import { List } from "@prisma/client";
import { DeletedResponse, OkResponse } from "../../utils/api/api-response";
import ListService from "./service";
import * as validator from "./validator";
import * as generalValidator from "../../utils/general-validator";
import ItemService from "../items/service";
import { validateQuantityOnCreate } from "./helpers";
import { BadRequestError } from "../../utils/api/api-error";
import { reshapeData } from "../../utils/reshape-data";
import logger from "../../utils/config/logger";
import saveImageInServer from "../../utils/save-image-in-server";
import deleteImageFromServer from "../../utils/delete-image-from-server";

export const getLists = async (req: Request, res: Response) => {
  const listQuery = await validator.getLists(req);

  if (listQuery.responsible) {
    const lists = await ListService.getResponsibleLists(
      listQuery.responsible,
      listQuery.order
    );
    return new OkResponse(lists!).send(res);
  }

  if (listQuery.room) {
    const lists = await ListService.getRoomLists(
      listQuery.room,
      listQuery.order
    );
    return new OkResponse(lists!).send(res);
  }

  const lists = await ListService.getlists(listQuery.order);

  const reshapedlists = reshapeData(lists, [
    "responsible.password",
    "responsible.roleId",
  ]) as List[];

  return new OkResponse(reshapedlists).send(res);
};

export const getList = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);

  const idNumber = Number(id);

  const list = await ListService.getList(idNumber);

  if (list) {
    return new OkResponse(list).send(res);
  }

  throw new BadRequestError("list not found");
};

export const createList = async (req: Request, res: Response) => {
  const inputList = await validator.createList(req);
  const prismaOperations = [];

  const imageUrl = saveImageInServer(req);

  // eslint-disable-next-line no-restricted-syntax
  for await (const item of inputList.items) {
    const originalItem = await ItemService.findItemByName(item.name);
    if (!originalItem)
      throw new BadRequestError(`couldn't find item ${item.name}`);

    prismaOperations.push(
      validateQuantityOnCreate(item.quantity, originalItem!)
    );
  }

  const list = await ListService.createList(
    inputList,
    prismaOperations,
    imageUrl
  );

  return new OkResponse(list).send(res);
};

export const deleteList = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);

  const idNumber = Number(id);

  const oldList = await ListService.getList(idNumber);

  if (oldList?.orderImage) {
    deleteImageFromServer(oldList.orderImage);
  }

  await ListService.deleteList(idNumber);

  return new DeletedResponse("").send(res);
};
