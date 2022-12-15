import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppUserTransmissionService {
  private id: number = 0;
  private telephone: string | null = '';
  private addresse: string | null = '';
  private prenom: string | null = '';
  private nom: string | null = '';
  private email: string | null = '';

  public getId(): number {
    return this.id;
  }

  public setId(v: number) {
    this.id = v;
  }

  public getTel(): string | null {
    return this.telephone;
  }

  public setTel(v: string | null) {
    this.telephone = v;
  }

  public getAddresse(): string | null {
    return this.addresse;
  }

  public setAddresse(v: string | null) {
    this.addresse = v;
  }

  public getPrenom(): string | null {
    return this.prenom;
  }

  public setPrenom(v: string | null) {
    this.prenom = v;
  }

  public getNom(): string | null {
    return this.nom;
  }

  public setNom(v: string | null) {
    this.nom = v;
  }

  public getEmail(): string | null {
    return this.email;
  }

  public setEmail(v: string | null) {
    this.email = v;
  }
}
