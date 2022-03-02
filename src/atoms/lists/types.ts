export type InputList = {
  roomId: number;
  responsibleId: number;
  items: {
    name: string;
    description?: string;
    image?: string;
    quantity: number;
  }[];
  orderImage?: string;
  dateInUse?: Date;
};
