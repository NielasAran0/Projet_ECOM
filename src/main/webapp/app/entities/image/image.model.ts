import { IProduct } from 'app/entities/product/product.model';

export interface IImage {
  id: number;
  url?: string | null;
  product?: Pick<IProduct, 'id'> | null;
}

export type NewImage = Omit<IImage, 'id'> & { id: null };
