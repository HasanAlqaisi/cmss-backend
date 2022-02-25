import { Year } from "@prisma/client";
import prisma from "../../prisma";

export default class YearService {
  static getYears = async (): Promise<Year[]> => {
    const years = await prisma.year.findMany();
    return years;
  };
}
