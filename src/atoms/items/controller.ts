import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { DeletedResponse, OkResponse } from "../../utils/api/api-response";
import ItemService from "./service";
import * as validator from "./validator";
import * as generalValidator from "../../utils/general-validator";
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
    itemQuery.name
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

  let imageUrl: string | undefined;

  if (req.file) {
    const fileName = new Date().getTime().toString() + req.file.originalname;

    imageUrl = path.join(
      process.env.CLIENT_DOMAIN as string,
      `public/images/${fileName}`
    );

    const dirPath = path.join(
      process.env.PWD as string,
      `src/public/images/${fileName}`
    );

    fs.writeFileSync(dirPath, req.file.buffer);
  }

  if (isExported) {
    const item = await ItemService.createExportedItem(inputItem, imageUrl);
    return new OkResponse(item).send(res);
  }

  if (isBroken) {
    const item = await ItemService.createBrokenItem(inputItem, imageUrl);
    return new OkResponse(item).send(res);
  }

  const item = await ItemService.createItem(inputItem, imageUrl);
  return new OkResponse(item).send(res);
};

export const deleteItem = async (req: Request, res: Response) => {
  const { id } = await generalValidator.id(req);

  const type = await validator.itemQuery(req);
  const isExported = type.exported === "true";
  const isBroken = type.broken === "true";

  const idNumber = Number(id);

  const oldItem = await ItemService.getItem(idNumber);

  if (oldItem?.image) {
    const imagePath = path.join(process.env.PWD as string, `src`);

    const oldImageUrl = oldItem.image.replace(
      process.env.CLIENT_DOMAIN as string,
      imagePath
    );

    fs.unlinkSync(oldImageUrl);
  }

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

  const idNumber = Number(id);

  const inputItem = await validator.upsertItem(req);

  const oldItem = await ItemService.getItem(idNumber);

  if (oldItem?.image) {
    const imagePath = path.join(process.env.PWD as string, `src`);

    const oldImageUrl = oldItem.image.replace(
      process.env.CLIENT_DOMAIN as string,
      imagePath
    );

    fs.unlinkSync(oldImageUrl);
  }

  let imageUrl: string | undefined;

  if (req.file) {
    const fileName = new Date().getTime().toString() + req.file.originalname;

    imageUrl = path.join(
      process.env.CLIENT_DOMAIN as string,
      `public/images/${fileName}`
    );

    const dirPath = path.join(
      process.env.PWD as string,
      `src/public/images/${fileName}`
    );

    fs.writeFileSync(dirPath, req.file.buffer);
  }

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
