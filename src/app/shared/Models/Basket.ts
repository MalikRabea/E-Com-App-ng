import { v4 as uuidv4 } from 'uuid';
export interface IBasket {
  id: string;
  PaymentIntentId: string;
  clientSecret: string;
  basketItems: IBasketItem[];
}

export interface IBasketItem {
  id: number;
  name: string;
  image: string;
  quantity: number;
  price: number;
  category: string;
  description: string;
}
export class Basket implements IBasket {
  PaymentIntentId: string;
  clientSecret: string;
  id = uuidv4();
  basketItems: IBasketItem[] = [];
}
export interface IBasketTotal {
  shipping: number;
  subtotal: number;
  total: number;
}
