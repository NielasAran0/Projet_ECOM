import dayjs from 'dayjs/esm';
import { IAppUser } from 'app/entities/app-user/app-user.model';
import { OrderState } from 'app/entities/enumerations/order-state.model';

export interface IUserOrder {
  id: number;
  totalPrice?: number | null;
  discount?: number | null;
  state?: OrderState | null;
  date?: dayjs.Dayjs | null;
  appUser?: Pick<IAppUser, 'id'> | null;
}

export type NewUserOrder = Omit<IUserOrder, 'id'> & { id: null };
