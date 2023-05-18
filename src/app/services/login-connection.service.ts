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

  tokenGeneration(correo: string) {
    const jsonCorreo = { "correo": correo }
    return this.Http.post<string>(`${this.url}token`, jsonCorreo).subscribe((res: any) => {

      sessionStorage.setItem("token", res.token);

      this.router.navigate(['index']);
    });
  }

  login(User: any) {

    this.waitMessage();

    return this.Http.post<any[]>(`${this.url}login`, User).subscribe((res: any) => {

      if (res.response.status == "ok") {

        this.showMessage(res.response.result.information);

        console.log(res.response.result.information);

        sessionStorage.setItem('correo', res.response.result.information);

        sessionStorage.setItem('code', res.response.result.code);

        this.router.navigate(['verify']);

      } else {
        console.log(res.response.result.error_msg)
        this.errorMessage(res.response.result.error_msg)
      }
    });
  }
  waitMessage() {
    Swal.fire({ text: "Espera, enviando codigo al correo.", icon: 'info' });
  }

  showMessage(message = "correo") {
    Swal.fire({
      icon: 'success',
      title: 'Correo enviado correctamente.',
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

  register(User: any) {

    return this.Http.post<any[]>(`${this.url}register`, User);
  }


}



