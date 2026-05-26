export interface ICreateOrder {
  deliveryMethodId: number;
  basketId: string;
  shipAddress: IShippingAddress;
}
export interface IShippingAddress {
  firstName: string;
  lastName: string;
  city: string;
  zipCode: string;
  street: string;
  state: string;
}
export interface IOrder {
  id: number;
  buyerEmail: string;
  subTotal: number;
  total: number;
  orderDate: string;
  shippingAddress: IShippingAddress;
  orderItems: IOrderItem[];
  deliveryMethod: string;
  status: string;
}
export interface IOrderItem {
  productItemId: number;
  mainImage: string;
  productName: string;
  price: number;
  quntity: number;
}
