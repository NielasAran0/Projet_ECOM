import { IOrderLine, NewOrderLine } from './order-line.model';

export const sampleWithRequiredData: IOrderLine = {
  id: 13942,
};

export const sampleWithPartialData: IOrderLine = {
  id: 62523,
};

export const sampleWithFullData: IOrderLine = {
  id: 78913,
  quantity: 45770,
  unitPrice: 61734,
  delivered: false,
};

export const sampleWithNewData: NewOrderLine = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
