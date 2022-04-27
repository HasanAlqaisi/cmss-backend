import { Item } from "@prisma/client";
import prisma from "../../prisma";
import { BadRequestError } from "../../utils/api/api-error";

// eslint-disable-next-line import/prefer-default-export
export const validateQuantityOnCreate = (
  quantityAddedItem: number,
  originalItem: Item
) => {
  const newOriginalQuantity = originalItem!.quantity - quantityAddedItem;

  if (newOriginalQuantity >= 0) {
    const item = prisma.item.update({
      where: { id: originalItem!.id },
      data: { quantity: newOriginalQuantity },
    });

    return item;
  }

  throw new BadRequestError("quantity can not be less than 0");
};
