import { Room } from "@prisma/client";
import prisma from "../../prisma";

export default class RoomService {
  static getRooms = async (): Promise<Room[]> => {
    const rooms = await prisma.room.findMany();
    return rooms;
  };

  static createRoom = async (number: number, name?: string): Promise<Room> => {
    const room = await prisma.room.create({
      data: {
        number,
        name,
      },
    });

    return room;
  };

  static deleteRoom = async (id: number): Promise<void> => {
    await prisma.room.delete({ where: { id } });
  };

  static updateRoom = async (
    id: number,
    number: number,
    name: string
  ): Promise<Room> => {
    const room = await prisma.room.update({
      where: { id },
      data: { name, number },
    });

    return room;
  };
}
