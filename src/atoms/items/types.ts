export type InputItem = {
  name: string;
  quantity: number;
  description?: string;
  image?: string;
  categoryId?: number;
  date?: Date;
};

export type InputBrokenItem = {
  name: string;
  quantity: number;
  description?: string;
  image?: string;
  date?: Date;
};

export type InputExportedItem = {
  name: string;
  quantity: number;
  description?: string;
  image?: string;
  date?: Date;
};
