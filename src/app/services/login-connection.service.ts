import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class LoginConnectionService {

  private token: string = '';
  private url = "http://localhost:4000/";

  constructor(private Http: HttpClient) { }

  login(User: any) {

    return this.Http.post<any[]>(`${this.url}login`, User).subscribe((res: any) => {

      if (res.response.status == "ok") {

        alert("Correcto");

        //segunda verificacion, mostramos en pantalla algo para comparar los tokens

        // this.token = res.response.result.token;
        // console.log(this.token)
        // localStorage.setItem('token', this.token);

      } else {

        alert(res.response.result);

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
