import { BrokenItem, ExportedItem, Item, Prisma } from "@prisma/client";
import { isNaN } from "lodash";
import prisma from "../../prisma";
import { BadRequestError, NotFoundError } from "../../utils/api/api-error";
import logger from "../../utils/config/logger";
import {
  validateQuantityOnCreate,
  validateQuantityOnDelete,
  validateQuantityOnUpdate,
} from "./helpers";
import { InputBrokenItem, InputExportedItem, InputItem } from "./types";

export default class ItemService {
  static getInventoryItems = async (
    order: Prisma.SortOrder,
    searchQuery?: string,
    categoryId?: number
  ) => {
    const items = await prisma.item.findMany({
      orderBy: [{ quantity: order }],
      where: {
        name: { search: searchQuery?.split(" ").join(" & ") },
        category: { id: isNaN(categoryId) ? undefined : categoryId },
      },
      include: { category: true },
    });
    return items;
  };

  static getExportedItems = async (
    order: Prisma.SortOrder,
    searchQuery?: string
  ) => {
    const items = await prisma.exportedItem.findMany({
      orderBy: [{ quantity: order }],
      where: { name: { search: searchQuery?.split(" ").join(" & ") } },
    });
    return items;
  };

  static getBrokenItems = async (
    order: Prisma.SortOrder,
    searchQuery?: string
  ) => {
    const items = await prisma.brokenItem.findMany({
      orderBy: [{ quantity: order }],
      where: { name: { search: searchQuery?.split(" ").join(" & ") } },
    });
    return items;
  };

  static getExportedItemById = async (id: number) => {
    const item = await prisma.exportedItem.findUnique({ where: { id } });
    return item;
  };

  static getBrokenItemById = async (id: number) => {
    const item = await prisma.brokenItem.findUnique({ where: { id } });
    return item;
  };

  static createItem = async (inputItem: InputItem, imageUrl?: string) => {
    const item = await prisma.item.create({
      data: {
        name: inputItem.name,
        quantity: inputItem.quantity,
        description: inputItem.description,
        image: imageUrl,
        category: inputItem.categoryId
          ? { connect: { id: inputItem.categoryId } }
          : undefined,
        dateReceived: inputItem.date ? inputItem.date.toISOString() : undefined,
      },
      include: { category: true },
    });
    return item;
  };

  static findItemByName = async (name: string) => {
    const item = await prisma.item.findUnique({
      where: { name },
      include: { category: true },
    });

    return item;
  };

  static createBrokenItem = async (
    inputItem: InputBrokenItem,
    imageUrl?: string
  ) => {
    const originalItem = await ItemService.findItemByName(inputItem.name);

    const createOperation = prisma.brokenItem.create({
      data: {
        name: inputItem.name,
        quantity: inputItem.quantity,
        description: inputItem.description,
        image: imageUrl,
        dateBroke: inputItem.date ? inputItem.date.toISOString() : undefined,
      },
    });

    if (!originalItem) {
      return createOperation;
    }

    const brokenItem = await validateQuantityOnCreate(
      inputItem,
      originalItem,
      async (updatedOriginalItem) => {
        const transaction = await prisma.$transaction([
          updatedOriginalItem,
          createOperation,
        ]);

        return transaction[1];
      }
    );
    return brokenItem;
  };

  static createExportedItem = async (
    inputItem: InputExportedItem,
    imageUrl?: string
  ) => {
    const originalItem = await ItemService.findItemByName(inputItem.name);

    const createOperation = prisma.exportedItem.create({
      data: {
        name: inputItem.name,
        quantity: inputItem.quantity,
        description: inputItem.description,
        image: imageUrl,
        dateExported: inputItem.date ? inputItem.date.toISOString() : undefined,
      },
    });

    if (!originalItem) {
      return createOperation;
    }

    const exportedItem = await validateQuantityOnCreate(
      inputItem,
      originalItem,
      async (updatedOriginalItem) => {
        const transaction = await prisma.$transaction([
          updatedOriginalItem,
          createOperation,
        ]);

        return transaction[1];
      }
    );
    return exportedItem;
  };

  static updateItem = async (
    itemId: number,
    inputItem: InputItem,
    imageUrl?: string
  ) => {
    const item = await prisma.item.update({
      where: { id: itemId },
      data: {
        name: inputItem.name,
        quantity: inputItem.quantity,
        description: inputItem.description,
        image: imageUrl,
        category: inputItem.categoryId
          ? { connect: { id: inputItem.categoryId } }
          : undefined,
        dateReceived: inputItem.date ? inputItem.date.toISOString() : undefined,
      },
      include: { category: true },
    });
    return item;
  };

  static updateExportedItem = async (
    id: number,
    inputItem: InputExportedItem,
    imageUrl?: string
  ) => {
    const originalItem = await ItemService.findItemByName(inputItem.name);
    const oldExportedItem = await this.getExportedItemById(id);

    const updateItemOperation = prisma.exportedItem.update({
      where: { id },
      data: {
        name: inputItem.name,
        quantity: inputItem.quantity,
        description: inputItem.description,
        image: imageUrl,
        dateExported: inputItem.date ? inputItem.date.toISOString() : undefined,
      },
    });

    if (!originalItem) {
      const item = await updateItemOperation;
      return item;
    }

    const updatedItem = await validateQuantityOnUpdate(
      inputItem,
      oldExportedItem!,
      originalItem,
      async (updatedOriginalItem) => {
        const transaction = await prisma.$transaction([
          updatedOriginalItem,
          updateItemOperation,
        ]);

        return transaction[1];
      }
    );
    return updatedItem;
  };

  static updateBrokenItem = async (
    id: number,
    inputItem: InputBrokenItem,
    imageUrl?: string
  ) => {
    const originalItem = await ItemService.findItemByName(inputItem.name);

    const oldBrokenItem = await this.getBrokenItemById(id);

    const updateItemOperation = prisma.brokenItem.update({
      where: { id },
      data: {
        name: inputItem.name,
        quantity: inputItem.quantity,
        description: inputItem.description,
        image: imageUrl,
        dateBroke: inputItem.date ? inputItem.date.toISOString() : undefined,
      },
    });

    if (!originalItem) {
      const item = await updateItemOperation;
      return item;
    }

    const updatedItem = await validateQuantityOnUpdate(
      inputItem,
      oldBrokenItem!,
      originalItem,
      async (updatedOriginalItem) => {
        const transaction = await prisma.$transaction([
          updatedOriginalItem,
          updateItemOperation,
        ]);

        return transaction[1];
      }
    );
    return updatedItem;
  };

  static getItem = async (itemId: number) => {
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: {
        category: true,
      },
    });
    return item;
  };

  static deleteItem = async (item: Item | null): Promise<void> => {
    if (item) {
      await prisma.item.delete({ where: { id: item.id } });
    } else {
      throw new BadRequestError("Item not found");
    }
  };

  static deleteBrokenItem = async (
    brokenItem: BrokenItem | null
  ): Promise<void> => {
    if (brokenItem) {
      const originalItem = await ItemService.findItemByName(brokenItem.name);

      const deleteOperation = prisma.brokenItem.delete({
        where: { id: brokenItem.id },
      });

      if (!originalItem) {
        await deleteOperation;
        return;
      }

      validateQuantityOnDelete(
        brokenItem!,
        originalItem,
        async (updatedOriginalItem) => {
          await prisma.$transaction([updatedOriginalItem, deleteOperation]);
        }
      );
    } else {
      throw new BadRequestError("Item not found");
    }
  };

  static deleteExportedItem = async (
    exportedItem: ExportedItem | null
  ): Promise<void> => {
    if (exportedItem) {
      const originalItem = await ItemService.findItemByName(exportedItem!.name);

      const deleteOperation = prisma.exportedItem.delete({
        where: { id: exportedItem.id },
      });

      if (!originalItem) {
        await deleteOperation;
        return;
      }

      validateQuantityOnDelete(
        exportedItem!,
        originalItem,
        async (updatedOriginalItem) => {
          await prisma.$transaction([updatedOriginalItem, deleteOperation]);
        }
      );
    } else {
      throw new BadRequestError("Item not found");
    }
  };
}
