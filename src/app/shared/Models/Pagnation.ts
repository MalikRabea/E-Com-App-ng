import { IProduct } from "./Product"

export interface IPagnation {
    pageNumber: number
    pageSize: number
    totalCount: number
    data: IProduct[]
  }
 