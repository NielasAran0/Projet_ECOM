import { IImage, NewImage } from './image.model';

export const sampleWithRequiredData: IImage = {
  id: 41829,
};

export const sampleWithPartialData: IImage = {
  id: 17155,
};

export const sampleWithFullData: IImage = {
  id: 73001,
  url: 'https://rosa.org',
};

export const sampleWithNewData: NewImage = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
