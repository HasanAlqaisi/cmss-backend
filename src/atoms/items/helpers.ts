import { BrokenItem, ExportedItem, Item, Prisma } from "@prisma/client";
import multer from "multer";
import path from "path";
import prisma from "../../prisma";
import { BadRequestError } from "../../utils/api/api-error";
import { InputBrokenItem, InputExportedItem } from "./types";

export const validateQuantityOnCreate = async (
  inputItem: InputExportedItem | InputBrokenItem,
  originalItem: Item,
  onValid: (
    updatedOriginalItemOperation: Prisma.Prisma__ItemClient<Item>
  ) => Promise<BrokenItem | ExportedItem>
) => {
  const newOriginalQuantity = originalItem!.quantity - inputItem.quantity;

  if (newOriginalQuantity >= 0) {
    const updatedOriginalItem = prisma.item.update({
      where: { id: originalItem!.id },
      data: { quantity: newOriginalQuantity },
    });
    return onValid(updatedOriginalItem);
  }

  throw new BadRequestError("quantity can not be less than 0");
};

export const validateQuantityOnUpdate = async (
  inputItem: InputExportedItem | InputBrokenItem,
  oldItem: ExportedItem | BrokenItem,
  originalItem: Item,
  onValid: (
    updatedOriginalItemOperation: Prisma.Prisma__ItemClient<Item>
  ) => Promise<BrokenItem | ExportedItem>
) => {
  let newOriginalQuantity: number = originalItem.quantity;

  if (inputItem.quantity > oldItem.quantity) {
    newOriginalQuantity -= inputItem.quantity - oldItem!.quantity;
    if (newOriginalQuantity < 0) {
      throw new BadRequestError("quantity can not be less than 0");
    }
  }

  if (inputItem.quantity < oldItem!.quantity) {
    newOriginalQuantity += oldItem!.quantity - inputItem.quantity;
  }

  const updatedOriginalItem = prisma.item.update({
    where: { id: originalItem!.id },
    data: { quantity: newOriginalQuantity },
  });

  return onValid(updatedOriginalItem);
};

export const validateQuantityOnDelete = async (
  brokenItem: ExportedItem | BrokenItem,
  originalItem: Item,
  onValid: (
    updatedOriginalItemOperation: Prisma.Prisma__ItemClient<Item>
  ) => Promise<void>
) => {
  const newOriginalQuantity = originalItem.quantity + brokenItem.quantity;

  const updatedOriginalItem = prisma.item.update({
    where: { id: originalItem!.id },
    data: { quantity: newOriginalQuantity },
  });

  return onValid(updatedOriginalItem);
};

export const uploadOnMemory = multer({ storage: multer.memoryStorage() });

export const uploadOnDisk = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) =>
      cb(null, path.join(__dirname, "../../public")),
    filename: (req, file, cb) => {
      cb(
        null,
        new Date().getTime().toString() + path.extname(file.originalname)
      );
    },
  }),
});
