import prisma from "../../prisma";

export default class BranchService {
  static getCategories = async () => {
    const categories = await prisma.category.findMany();
    return categories;
  };

  static createCategory = async (name: string) => {
    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    return category;
  };

  static deleteCategory = async (id: number): Promise<void> => {
    await prisma.category.delete({ where: { id } });
  };

  static updateCategory = async (id: number, name: string) => {
    const category = await prisma.category.update({
      where: { id },
      data: { name },
    });

    return category;
  };
}
