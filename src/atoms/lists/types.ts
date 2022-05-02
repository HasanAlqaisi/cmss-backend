export type InputList = {
  roomId: number;
  responsibleId: number;
  items: { id: number; quantity: number }[];
  orderImage?: string;
  dateInUse?: Date;
};

export type ListItems = {
  name: string;
  image?: string,
  description?: string,
  quantity: number,
};
