import { BrokenItem } from "@prisma/client";
import prisma from "../../prisma";
import { BadRequestError } from "../../utils/api/api-error";
import {
  validateQuantityOnCreate,
  validateQuantityOnDelete,
  validateQuantityOnUpdate,
} from "./helpers";
import { InputBrokenItem, InputExportedItem, InputItem } from "./types";

export default class ItemService {
  static getInventoryItems = async () => {
    const items = await prisma.item.findMany();
    return items;
  };

  static getRoomItems = async (roomId: number) => {
    const items = await prisma.room.findUnique({
      where: { id: roomId },
      include: { items: true },
    });

    return items;
  };

  static getExportedItems = async () => {
    const items = await prisma.exportedItem.findMany();
    return items;
  };

  static getBrokenItems = async () => {
    const items = await prisma.brokenItem.findMany();
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

  static createItem = async (inputItem: InputItem) => {
    const item = await prisma.item.create({
      data: {
        name: inputItem.name,
        quantity: inputItem.quantity,
        description: inputItem.description,
        image: inputItem.image,
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
    });

    return item;
  };

  static createBrokenItem = async (inputItem: InputBrokenItem) => {
    const originalItem = await ItemService.findItemByName(inputItem.name);

    const createOperation = prisma.brokenItem.create({
      data: {
        name: inputItem.name,
        quantity: inputItem.quantity,
        description: inputItem.description,
        image: inputItem.image,
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

  static createExportedItem = async (inputItem: InputExportedItem) => {
    const originalItem = await ItemService.findItemByName(inputItem.name);

    const createOperation = prisma.exportedItem.create({
      data: {
        name: inputItem.name,
        quantity: inputItem.quantity,
        description: inputItem.description,
        image: inputItem.image,
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

  static updateItem = async (itemId: number, inputItem: InputItem) => {
    const item = await prisma.item.update({
      where: { id: itemId },
      data: {
        name: inputItem.name,
        quantity: inputItem.quantity,
        description: inputItem.description,
        image: inputItem.image,
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
    inputItem: InputExportedItem
  ) => {
    const originalItem = await ItemService.findItemByName(inputItem.name);
    const oldExportedItem = await this.getExportedItemById(id);

    const updateItemOperation = prisma.exportedItem.update({
      where: { id },
      data: {
        name: inputItem.name,
        quantity: inputItem.quantity,
        description: inputItem.description,
        image: inputItem.image,
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

  static updateBrokenItem = async (id: number, inputItem: InputBrokenItem) => {
    const originalItem = await ItemService.findItemByName(inputItem.name);

    const oldBrokenItem = await this.getBrokenItemById(id);

    const updateItemOperation = prisma.brokenItem.update({
      where: { id },
      data: {
        name: inputItem.name,
        quantity: inputItem.quantity,
        description: inputItem.description,
        image: inputItem.image,
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

  // static createList = async (roomId: number, responsibleId: number) => {
  //   // Need to dec quantity original items
  //   const list = await prisma.list.create({
  //     data: {
  //       Room: { connect: { id: roomId } },
  //       responsible: { connect: { id: responsibleId } },
  //       orderImage: "",
  //       items: { create: [{ itemId: 1, quantity: 2 }] },
  //     },
  //     include: { items: true, responsible: true, Room: true },
  //   });
  //   return list;
  // };

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

  // static getRoomLists = async (roomId: number) => {
  //   const lists = await prisma.room.findUnique({
  //     where: { id: roomId },
  //     include: { lists: { include: { items: true, responsible: true } } },
  //   });

  //   return lists;
  // };

  // static getResponsibleLists = async (responsibleId: number) => {
  //   const lists = await prisma.user.findUnique({
  //     where: { id: responsibleId },
  //     include: { lists: { include: { items: true, Room: true } } },
  //   });

  //   return lists;
  // };

  // static getList = async (listId: number) => {
  //   const list = await prisma.list.findUnique({
  //     where: { id: listId },
  //     include: { items: true, Room: true, responsible: true },
  //   });

  //   return list;
  // };
}
