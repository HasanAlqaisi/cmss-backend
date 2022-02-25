import { Channel } from "@prisma/client";
import prisma from "../../prisma";

export default class BranchService {
  static getChannels = async (): Promise<Channel[]> => {
    const channel = await prisma.channel.findMany();
    return channel;
  };

  static createChannel = async (name: string): Promise<Channel> => {
    const channel = await prisma.channel.create({
      data: {
        name,
      },
    });

    return channel;
  };

  static deleteChannel = async (id: number): Promise<void> => {
    await prisma.channel.delete({ where: { id } });
  };

  static updateChannel = async (id: number, name: string): Promise<Channel> => {
    const channel = await prisma.channel.update({
      where: { id },
      data: { name },
    });

    return channel;
  };
}
