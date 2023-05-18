import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Entrada } from '../interface/entrada';

@Injectable({
  providedIn: 'root'
})
export class EntradaService {

  private url = "http://localhost:4000/Entradas/";

  constructor(private http: HttpClient) { }

  getEntrada(): Observable<Entrada[]> {
    //const token = sessionStorage.getItem('token');
    //const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    console.log(`${this.url}`);
    return this.http.get<Entrada[]>(`${this.url}`)

  }

  addEntrada(entrada: any) {
    console.log(`${this.url}add`);
    return this.http.post<any[]>(`${this.url}add`, entrada)
  }

  updateEntrada(entrada: any) {
    return this.http.put<any[]>(`${this.url}add`, entrada)
  }

  eliminarEntrada(Id: any) {
    return this.http.delete<any[]>(`${this.url}delete/${Id}`)
  }

}
