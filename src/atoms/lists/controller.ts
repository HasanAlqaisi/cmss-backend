/* eslint-disable no-restricted-syntax */
import { Request, Response } from "express";
import { List, ListItem } from "@prisma/client";
import {
  CreatedResponse,
  DeletedResponse,
  OkResponse,
} from "../../utils/api/api-response";
import * as validator from "./validator";
import * as generalValidator from "../../utils/general-validator";
import ItemService from "../items/service";
import { validateQuantityOnCreate } from "./helpers";
import { BadRequestError } from "../../utils/api/api-error";
import { reshapeData } from "../../utils/reshape-data";
import saveImageInServer from "../../utils/save-image-in-server";
import deleteImageFromServer from "../../utils/delete-image-from-server";
import { ListItems } from "./types";
import { ListService } from "./service";

export const getLists = async (req: Request, res: Response) => {
  const listQuery = await validator.getLists(req);

  let lists;
  if (listQuery.responsible) {
    lists = await ListService.getResponsibleLists(
      Number(listQuery.responsible),
      listQuery.order
    );
  } else if (listQuery.room) {
    lists = await ListService.getRoomLists(
      Number(listQuery.room),
      listQuery.order
    );
  } else {
    lists = await ListService.getlists(listQuery.order);
  }

  const reshapedlists = reshapeData(lists!, [
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
    const reshapedlist = reshapeData(list, [
      "responsible.password",
      "responsible.roleId",
    ]) as List;
    return new OkResponse(reshapedlist).send(res);
  }

  throw new BadRequestError("list not found");
};

export const createList = async (req: Request, res: Response) => {
  const inputList = await validator.createList(req);
  const prismaOperations = [];

  const imageUrl = saveImageInServer(req);

  const getItems = inputList.items.map((item) => ItemService.getItem(item.id));

  const originalItems = await Promise.all(getItems);

  const itemsInList: ListItems[] = [];

  for await (const originalItem of originalItems) {
    if (!originalItem) throw new BadRequestError(`couldn't find item `);

    for (const inputItem of inputList.items) {
      if (inputItem.id === originalItem.id) {
        itemsInList.push({
          name: originalItem.name,
          image: originalItem.image ?? undefined,
          description: originalItem.description ?? undefined,
          quantity: inputItem.quantity,
        });

        break;
      }
    }

    prismaOperations.push(
      validateQuantityOnCreate(
        itemsInList[itemsInList.length - 1].quantity,
        originalItem
      )
    );
  }

  const list = await ListService.createList(
    inputList,
    itemsInList,
    prismaOperations,
    imageUrl
  );

  const reshapedlist = reshapeData(list, [
    "responsible.password",
    "responsible.roleId",
  ]) as List;

  return new CreatedResponse(reshapedlist).send(res);
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
