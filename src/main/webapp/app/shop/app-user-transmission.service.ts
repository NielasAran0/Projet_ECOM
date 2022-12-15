import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppUserTransmissionService {
  private id = 0;
  private telephone: string | null = '';
  private addresse: string | null = '';

  public getId(): number {
    return this.id;
  }

  public setId(v: number): void {
    this.id = v;
  }

  public getTel(): string | null {
    return this.telephone;
  }

  public setTel(v: string | null): void {
    this.telephone = v;
  }

  public getAddresse(): string | null {
    return this.addresse;
  }

  public setAddresse(v: string | null): void {
    this.addresse = v;
  }
}
