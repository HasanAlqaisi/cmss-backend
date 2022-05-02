import { BrokenItem, ExportedItem, Item, Prisma } from "@prisma/client";
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

  throw new BadRequestError(
    "specified quantity should be less or equal the current item quantity"
  );
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
      throw new BadRequestError(
        "specified quantity should be less or equal the current item quantity"
      );
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
