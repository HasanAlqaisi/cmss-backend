import { Prisma } from "@prisma/client";
import prisma from "../../prisma";
import { InputList, ListItems } from "./types";

// eslint-disable-next-line import/prefer-default-export
export class ListService {
  static createList = async (
    inputList: InputList,
    listItems: ListItems[],
    updateOriginalItemsQUantity: Prisma.Prisma__ItemClient<any>[],
    orderImage?: string
  ) => {
    const list = prisma.list.create({
      data: {
        room: { connect: { id: inputList.roomId } },
        responsible: { connect: { id: inputList.responsibleId } },
        orderImage,
        dateInuse: inputList.dateInUse,
        items: {
          create: listItems,
        },
      },
      include: { items: true, responsible: true, room: true },
    });

    updateOriginalItemsQUantity.push(list as any);

    const trans = await prisma.$transaction(updateOriginalItemsQUantity);

    return trans.pop();
  };

  static deleteList = async (id: number): Promise<void> => {
    await prisma.list.delete({ where: { id } });
  };

  static getlists = async (order: Prisma.SortOrder) => {
    const lists = await prisma.list.findMany({
      orderBy: [{ dateInuse: order }],
      include: { items: true, responsible: true, room: true },
    });

    return lists;
  };

  static getRoomLists = async (roomId: number, order: Prisma.SortOrder) => {
    const lists = await prisma.list.findMany({
      where: { room: { id: roomId } },
      include: {
        items: true,
        responsible: true,
      },
      orderBy: [{ dateInuse: order }],
    });
    return lists;
  };

  static getResponsibleLists = async (
    responsibleId: number,
    order: Prisma.SortOrder
  ) => {
    const lists = await prisma.list.findMany({
      where: { responsible: { id: responsibleId } },
      include: {
        items: true,
        room: true,
      },
      orderBy: [{ dateInuse: order }],
    });

    return lists;
  };

  static getList = async (listId: number) => {
    const list = await prisma.list.findUnique({
      where: { id: listId },
      include: { items: true, room: true, responsible: true },
    });
    return list;
  };
}
