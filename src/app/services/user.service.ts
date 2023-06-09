import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { User } from '../interface/user';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = "http://localhost:4000/user";
  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}`)
  }

  getUserByCorreo(correo: any): Observable<User> {
    return this.http.get<User>(`${this.url}/${correo}`)
  }

  // /user/: id

  getAdministradores(): Observable<Administrador[]> {
    return this.http.get<Administrador[]>(`${this.url}/administradores`)
  }

  getViewAdministradores(): Observable<Administrador[]> {
    return this.http.get<Administrador[]>(`${this.url}/view_administradores`)
  }

  getPadron(Id: any): Observable<Padron> {
    return this.http.get<Padron>(`${this.url}/padron/${Id}`)
  }

  changePassword(usuario: User) {
    return this.http.put<any>(`${this.url}/changePassword/`, usuario)
  }

  editUser(usuario: User) {
    return this.http.put<any>(`${this.url}/editar`, usuario)
  }

  deleteUser(usuario: User) {

    return this.http.post<any[]>(`${this.url}/delete/`, usuario)
  }

}


export interface Administrador {

  cedula: string;
  nombre: string;
  apellido: string;

}

export interface Padron {
  cedula: string;
  nombre: string;
  apellido2: string;
  apellido1: string;

}