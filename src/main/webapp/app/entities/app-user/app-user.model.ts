import { IUserOrder } from 'app/entities/user-order/user-order.model';
import { IUser } from 'app/entities/user/user.model';

export interface IAppUser {
  id: number;
  telephone?: string | null;
  adresse?: string | null;
  cart?: Pick<IUserOrder, 'id'> | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewAppUser = Omit<IAppUser, 'id'> & { id: null };
