import { Request, Response } from "express";
import {
  CreatedResponse,
  DeletedResponse,
  OkResponse,
} from "../../utils/api/api-response";
import ItemService from "./service";
import * as validator from "./validator";
import * as generalValidator from "../../utils/general-validator";
import saveImageInServer from "../../utils/save-image-in-server";
import deleteImageFromServer from "../../utils/delete-image-from-server";
import logger from "../../utils/config/logger";

export const getItems = async (req: Request, res: Response) => {
  const itemQuery = await validator.itemsQuery(req);
  const isExported = itemQuery.exported === "true";
  const isBroken = itemQuery.broken === "true";

  if (isExported) {
    const items = await ItemService.getExportedItems(
      itemQuery.order,
      itemQuery.name
    );
    return new OkResponse(items).send(res);
  }

  if (isBroken) {
    const items = await ItemService.getBrokenItems(
      itemQuery.order,
      itemQuery.name
    );
    return new OkResponse(items).send(res);
  }

  const items = await ItemService.getInventoryItems(
    itemQuery.order,
    itemQuery.name,
    Number(itemQuery.categoryId)
  );
  return new OkResponse(items).send(res);
};

export const getItem = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);

  const type = await validator.itemQuery(req);
  const isExported = type.exported === "true";
  const isBroken = type.broken === "true";

  const idNumber = Number(id);

  if (isExported) {
    const item = await ItemService.getExportedItemById(idNumber);
    return new OkResponse(item!).send(res);
  }

  if (isBroken) {
    const item = await ItemService.getBrokenItemById(idNumber);
    return new OkResponse(item!).send(res);
  }

  const item = await ItemService.getItem(idNumber);
  return new OkResponse(item!).send(res);
};

export const createItem = async (req: Request, res: Response) => {
  const inputItem = await validator.upsertItem(req);
  const type = await validator.itemQuery(req);
  const isExported = type.exported === "true";
  const isBroken = type.broken === "true";

  const imageUrl = saveImageInServer(req);

  if (isExported) {
    const item = await ItemService.createExportedItem(inputItem, imageUrl);
    return new OkResponse(item).send(res);
  }

  if (isBroken) {
    const item = await ItemService.createBrokenItem(inputItem, imageUrl);
    return new OkResponse(item).send(res);
  }

  const item = await ItemService.createItem(inputItem, imageUrl);
  return new CreatedResponse(item).send(res);
};

export const deleteItem = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);
  const type = await validator.itemQuery(req);
  const isExported = type.exported === "true";
  const isBroken = type.broken === "true";

  const idNumber = Number(id);

  let oldItem;

  if (isExported) {
    oldItem = await ItemService.getExportedItemById(idNumber);
    await ItemService.deleteExportedItem(oldItem);
  } else if (isBroken) {
    oldItem = await ItemService.getBrokenItemById(idNumber);
    await ItemService.deleteBrokenItem(oldItem);
  } else {
    oldItem = await ItemService.getItem(idNumber);
    await ItemService.deleteItem(oldItem);
  }

  if (oldItem && oldItem.image) deleteImageFromServer(oldItem.image);

  return new DeletedResponse("").send(res);
};

export const updateItem = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);

  const idNumber = Number(id);

  const inputItem = await validator.upsertItem(req);

  const oldItem = await ItemService.getItem(idNumber);

  if (oldItem?.image) {
    deleteImageFromServer(oldItem.image);
  }

  const imageUrl = saveImageInServer(req);

  const type = await validator.itemQuery(req);
  const isExported = type.exported === "true";
  const isBroken = type.broken === "true";

  if (isExported) {
    const item = await ItemService.updateExportedItem(
      idNumber,
      inputItem,
      imageUrl
    );
    return new OkResponse(item).send(res);
  }

  if (isBroken) {
    const item = await ItemService.updateBrokenItem(
      idNumber,
      inputItem,
      imageUrl
    );
    return new OkResponse(item).send(res);
  }

  const item = await ItemService.updateItem(idNumber, inputItem, imageUrl);
  return new OkResponse(item).send(res);
};
