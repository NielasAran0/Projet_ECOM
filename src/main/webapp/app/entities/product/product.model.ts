import { IAppUser } from 'app/entities/app-user/app-user.model';
import { ICategory } from 'app/entities/category/category.model';
import { IImage } from 'app/entities/image/image.model';

export interface IProduct {
  id: number;
  name?: string | null;
  description?: string | null;
  seller?: Pick<IAppUser, 'id'> | null;
  categories?: Pick<ICategory, 'id'>[] | null;
  images?: Pick<IImage, 'id'>[] | null;
}

export type NewProduct = Omit<IProduct, 'id'> & { id: null };
