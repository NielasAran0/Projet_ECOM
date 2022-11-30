import { IUserOrder } from 'app/entities/user-order/user-order.model';

export interface IAppUser {
  id: number;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  password?: string | null;
  telephone?: string | null;
  adresse?: string | null;
  cart?: Pick<IUserOrder, 'id'> | null;
}

export type NewAppUser = Omit<IAppUser, 'id'> & { id: null };
