import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IImage, NewImage } from '../image.model';

export type PartialUpdateImage = Partial<IImage> & Pick<IImage, 'id'>;

export type EntityResponseType = HttpResponse<IImage>;
export type EntityArrayResponseType = HttpResponse<IImage[]>;

@Injectable({ providedIn: 'root' })
export class ImageService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/images');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(image: NewImage): Observable<EntityResponseType> {
    return this.http.post<IImage>(this.resourceUrl, image, { observe: 'response' });
  }

  update(image: IImage): Observable<EntityResponseType> {
    return this.http.put<IImage>(`${this.resourceUrl}/${this.getImageIdentifier(image)}`, image, { observe: 'response' });
  }

  partialUpdate(image: PartialUpdateImage): Observable<EntityResponseType> {
    return this.http.patch<IImage>(`${this.resourceUrl}/${this.getImageIdentifier(image)}`, image, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IImage>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IImage[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getImageIdentifier(image: Pick<IImage, 'id'>): number {
    return image.id;
  }

  compareImage(o1: Pick<IImage, 'id'> | null, o2: Pick<IImage, 'id'> | null): boolean {
    return o1 && o2 ? this.getImageIdentifier(o1) === this.getImageIdentifier(o2) : o1 === o2;
  }

  addImageToCollectionIfMissing<Type extends Pick<IImage, 'id'>>(
    imageCollection: Type[],
    ...imagesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const images: Type[] = imagesToCheck.filter(isPresent);
    if (images.length > 0) {
      const imageCollectionIdentifiers = imageCollection.map(imageItem => this.getImageIdentifier(imageItem)!);
      const imagesToAdd = images.filter(imageItem => {
        const imageIdentifier = this.getImageIdentifier(imageItem);
        if (imageCollectionIdentifiers.includes(imageIdentifier)) {
          return false;
        }
        imageCollectionIdentifiers.push(imageIdentifier);
        return true;
      });
      return [...imagesToAdd, ...imageCollection];
    }
    return imageCollection;
  }
}
