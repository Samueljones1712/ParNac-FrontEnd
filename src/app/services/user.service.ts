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

  getUser(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}`)
  }

  changePassword(usuario: User) {
    return this.http.put<any>(`${this.url}/changePassword/`, usuario)
  }

  editUser(usuario: User) {
    return this.http.put<any>(`${this.url}/edit`, usuario)
  }

  deleteUser(Id: any) {

    return this.http.delete<any[]>(`${this.url}/delete/${Id}`)
  }

}
