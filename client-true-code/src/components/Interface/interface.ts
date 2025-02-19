export interface ProductInterface {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  images: string[];
}

export interface ApiResponseInterface {
  products: ProductInterface[];
  limit: number;
  page: number;
  total: number;
}
