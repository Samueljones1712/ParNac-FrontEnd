import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class LoginConnectionService {

  private token: string = '';
  private url = "http://localhost:4000/";

  constructor(private Http: HttpClient, private router: Router) { }

  login(User: any) {

    return this.Http.post<any[]>(`${this.url}login`, User).subscribe((res: any) => {

      if (res.response.status == "ok") {

        localStorage.setItem('correo', res.response.result.information.correo);

        localStorage.setItem('contrasena', res.response.result.information.contrasena);

        localStorage.setItem('code', res.response.result.code);

        this.router.navigate(['verify']);

      } else {

        alert(res.response.status)
      }
    });
  }

  logout() {
    this.token = '';
    localStorage.removeItem('token');
  }

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('token') + "";
    }
    return this.token;
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }


}



export interface User {

  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  token: string;
  salt: string;
}
