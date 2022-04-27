import { Prisma } from "@prisma/client";
import prisma from "../../prisma";
import { InputList } from "./types";

export default class ListService {
  static createList = async (
    inputList: InputList,
    updateOriginalItemsQUantity: Prisma.Prisma__ItemClient<any>[],
    orderImage?: string
  ) => {
    const list = prisma.list.create({
      data: {
        Room: { connect: { id: inputList.roomId } },
        responsible: { connect: { id: inputList.responsibleId } },
        orderImage,
        dateInuse: inputList.dateInUse,
        items: {
          create: inputList.items,
        },
      },
      include: { items: true, responsible: true, Room: true },
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
      include: { items: true, responsible: true, Room: true },
    });

    return lists;
  };

  static getRoomLists = async (roomId: number, order: Prisma.SortOrder) => {
    const lists = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        lists: {
          orderBy: [{ dateInuse: order }],
          include: { items: true, responsible: true },
        },
      },
    });
    return lists;
  };

  static getResponsibleLists = async (
    responsibleId: number,
    order: Prisma.SortOrder
  ) => {
    const lists = await prisma.user.findUnique({
      where: { id: responsibleId },
      include: {
        lists: {
          include: { items: true, Room: true },
          orderBy: [{ dateInuse: order }],
        },
      },
    });

    return lists;
  };

  static getList = async (listId: number) => {
    const list = await prisma.list.findUnique({
      where: { id: listId },
      include: { items: true, Room: true, responsible: true },
    });
    return list;
  };
}
