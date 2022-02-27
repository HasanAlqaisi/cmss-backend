import { Request, Response } from "express";
import { DeletedResponse, OkResponse } from "../../utils/api/api-response";
import ItemService from "./service";
import * as validator from "./validator";
import * as generalValidator from "../../utils/general-validator";

export const getItems = async (req: Request, res: Response) => {
  const type = await validator.itemType(req);
  const isExported = type.exported === "true";
  const isBroken = type.broken === "true";

  if (isExported) {
    const items = await ItemService.getExportedItems();
    return new OkResponse(items).send(res);
  }

  if (isBroken) {
    const items = await ItemService.getBrokenItems();
    return new OkResponse(items).send(res);
  }

  const items = await ItemService.getInventoryItems();
  return new OkResponse(items).send(res);
};

export const getRoomItems = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);

  const idNumber = Number(id);

  const items = await ItemService.getRoomItems(idNumber);

  return new OkResponse(items!).send(res);
};

export const getItem = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);

  const type = await validator.itemType(req);
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

  const type = await validator.itemType(req);
  const isExported = type.exported === "true";
  const isBroken = type.broken === "true";

  if (isExported) {
    const item = await ItemService.createExportedItem(inputItem);
    return new OkResponse(item).send(res);
  }

  if (isBroken) {
    const item = await ItemService.createBrokenItem(inputItem);
    return new OkResponse(item).send(res);
  }

  const item = await ItemService.createItem(inputItem);
  return new OkResponse(item).send(res);
};

export const deleteItem = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);

  const type = await validator.itemType(req);
  const isExported = type.exported === "true";
  const isBroken = type.broken === "true";

  const idNumber = Number(id);

  if (isExported) {
    await ItemService.deleteExportedItem(idNumber);
    return new DeletedResponse("").send(res);
  }

  if (isBroken) {
    await ItemService.deleteBrokenItem(idNumber);
    return new DeletedResponse("").send(res);
  }

  await ItemService.deleteItem(idNumber);
  return new DeletedResponse("").send(res);
};

export const updateItem = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);

  const inputItem = await validator.upsertItem(req);

  const type = await validator.itemType(req);
  const isExported = type.exported === "true";
  const isBroken = type.broken === "true";

  const idNumber = Number(id);

  if (isExported) {
    const item = await ItemService.updateExportedItem(idNumber, inputItem);
    return new OkResponse(item).send(res);
  }

  if (isBroken) {
    const item = await ItemService.updateBrokenItem(idNumber, inputItem);
    return new OkResponse(item).send(res);
  }

  const item = await ItemService.updateItem(idNumber, inputItem);
  return new OkResponse(item).send(res);
};
