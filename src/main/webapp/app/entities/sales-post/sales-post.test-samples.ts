import dayjs from 'dayjs/esm';

import { ISalesPost, NewSalesPost } from './sales-post.model';

export const sampleWithRequiredData: ISalesPost = {
  id: 83408,
};

export const sampleWithPartialData: ISalesPost = {
  id: 67029,
  stock: 36383,
};

export const sampleWithFullData: ISalesPost = {
  id: 89782,
  stock: 52615,
  price: 95224,
  limitDate: dayjs('2022-11-29'),
};

export const sampleWithNewData: NewSalesPost = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
