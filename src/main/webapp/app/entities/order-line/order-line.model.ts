import { IProduct } from 'app/entities/product/product.model';
import { IUserOrder } from 'app/entities/user-order/user-order.model';

export interface IOrderLine {
  id: number;
  quantity?: number | null;
  unitPrice?: number | null;
  delivered?: boolean | null;
  product?: Pick<IProduct, 'id'> | null;
  userOrder?: Pick<IUserOrder, 'id'> | null;
}

export type NewOrderLine = Omit<IOrderLine, 'id'> & { id: null };
