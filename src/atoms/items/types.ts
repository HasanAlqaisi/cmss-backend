export type InputItem = {
  name: string;
  quantity: number;
  description?: string;
  image?: string;
  categoryId?: number;
  dateReceived?: Date;
};

export type InputBrokenItem = {
  name: string;
  quantity: number;
  description?: string;
  image?: string;
  dateBroke?: Date;
};

export type InputExportedItem = {
  name: string;
  quantity: number;
  description?: string;
  image?: string;
  dateExported?: Date;
};