import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'



@Injectable({
  providedIn: 'root'
})
export class LoginConnectionService {


  loading: boolean = false;

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

    return this.Http.post<any[]>(`${this.url}login`, User)
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



