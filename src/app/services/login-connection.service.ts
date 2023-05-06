import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'
import Swal from 'sweetalert2'


@Injectable({
  providedIn: 'root'
})
export class LoginConnectionService {

  private token: string = '';
  private url = "http://localhost:4000/";
  swal: any;

  constructor(private Http: HttpClient, private router: Router) { }

  login(User: any) {

    this.waitMessage();

    return this.Http.post<any[]>(`${this.url}login`, User).subscribe((res: any) => {

      if (res.response.status == "ok") {

        this.showMessage(res.response.result.information.correo);

        localStorage.setItem('correo', res.response.result.information.correo);

        localStorage.setItem('contrasena', res.response.result.information.contrasena);

        localStorage.setItem('code', res.response.result.code);

        this.router.navigate(['verify']);

      } else {
        console.log(res.response.result.error_msg)
        this.errorMessage(res.response.result.error_msg)
      }
    });
  }
  waitMessage() {
    Swal.fire({ text: "Espera, confirmando credenciales", icon: 'warning' });
  }

  showMessage(message = "correo") {
    Swal.fire({
      icon: 'success',
      title: 'Se inicio Sesion Correctamente.',
      text: 'Revisa el correo electronico!',
      footer: '<a href="">' + message + '</a>'
    })
  }

  errorMessage(message = "No se pudo iniciar sesion") {
    Swal.fire({ text: message + "", icon: 'error' });
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
