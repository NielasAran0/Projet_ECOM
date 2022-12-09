import dayjs from 'dayjs/esm';
import { IProduct } from 'app/entities/product/product.model';
import { IAppUser } from 'app/entities/app-user/app-user.model';

export interface ISalesPost {
  id: number;
  stock?: number | null;
  price?: number | null;
  limitDate?: dayjs.Dayjs | null;
  product?: Pick<IProduct, 'id' | 'name' | 'description'> | null;
  appUser?: Pick<IAppUser, 'id'> | null;
}

export type NewSalesPost = Omit<ISalesPost, 'id'> & { id: null };
