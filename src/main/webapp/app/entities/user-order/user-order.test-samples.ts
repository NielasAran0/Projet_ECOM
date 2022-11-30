import dayjs from 'dayjs/esm';

import { OrderState } from 'app/entities/enumerations/order-state.model';

import { IUserOrder, NewUserOrder } from './user-order.model';

export const sampleWithRequiredData: IUserOrder = {
  id: 61291,
};

export const sampleWithPartialData: IUserOrder = {
  id: 3326,
  totalPrice: 49629,
  discount: 37807,
};

export const sampleWithFullData: IUserOrder = {
  id: 39926,
  totalPrice: 92855,
  discount: 80265,
  state: OrderState['CANCELED'],
  date: dayjs('2022-11-29'),
};

export const sampleWithNewData: NewUserOrder = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
