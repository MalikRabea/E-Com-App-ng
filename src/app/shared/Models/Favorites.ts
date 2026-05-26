// favorite.model.ts
export interface Photo {
  id: number;
  imageName: string;
  productId: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  newPrice: number;
  oldPrice: number;
  rating: number;
  soldCount: number;
  categoryId: number;
  category?: any; // optional
  photos: Photo[];
}

export interface Favorite {
  product: Product;
  productId: number;
  id: number; // favorite id
}
