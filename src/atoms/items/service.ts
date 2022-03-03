import { BrokenItem, Prisma } from "@prisma/client";
import prisma from "../../prisma";
import { BadRequestError } from "../../utils/api/api-error";
import {
  validateQuantityOnCreate,
  validateQuantityOnDelete,
  validateQuantityOnUpdate,
} from "./helpers";
import { InputBrokenItem, InputExportedItem, InputItem } from "./types";

export default class ItemService {
  static getInventoryItems = async (
    order: Prisma.SortOrder,
    searchQuery?: string
  ) => {
    const items = await prisma.item.findMany({
      orderBy: [{ quantity: order }],
      where: { name: { search: searchQuery } },
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
      where: { name: { search: searchQuery } },
    });
    return items;
  };

  static getBrokenItems = async (
    order: Prisma.SortOrder,
    searchQuery?: string
  ) => {
    const items = await prisma.brokenItem.findMany({
      orderBy: [{ quantity: order }],
      where: { name: { search: searchQuery } },
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
        dateReceived: inputItem.dateReceived
          ? inputItem.dateReceived.toISOString()
          : undefined,
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
        dateBroke: inputItem.dateBroke
          ? inputItem.dateBroke.toISOString()
          : undefined,
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
        dateExported: inputItem.dateExported
          ? inputItem.dateExported.toISOString()
          : undefined,
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
        dateReceived: inputItem.dateReceived
          ? inputItem.dateReceived.toISOString()
          : undefined,
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
        dateExported: inputItem.dateExported
          ? inputItem.dateExported.toISOString()
          : undefined,
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
        dateBroke: inputItem.dateBroke
          ? inputItem.dateBroke.toISOString()
          : undefined,
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

  static deleteItem = async (id: number): Promise<void> => {
    await prisma.item.delete({ where: { id } });
  };

  static deleteBrokenItem = async (id: number): Promise<void> => {
    const brokenItem = await ItemService.getBrokenItemById(id);

    const originalItem = await ItemService.findItemByName(brokenItem!.name);

    const deleteOperation = prisma.brokenItem.delete({ where: { id } });

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
  };

  static deleteExportedItem = async (id: number): Promise<void> => {
    const exportedItem = await ItemService.getExportedItemById(id);

    const originalItem = await ItemService.findItemByName(exportedItem!.name);

    const deleteOperation = prisma.exportedItem.delete({ where: { id } });

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
  };
}
