import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Entrada } from '../interface/entrada';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class EntradaService {

  private url = "http://localhost:4000/Entradas/";

  constructor(private http: HttpClient) { }

  getEntradas(): Observable<Entrada[]> {

    return this.http.get<Entrada[]>(`${this.url}`)

  }

  addEntrada(entrada: Entrada) {
    return this.http.post<any[]>(`${this.url}add`, entrada)
  }

  updateEntrada(entrada: any) {
    return this.http.put<any[]>(`${this.url}actualizar`, entrada)
  }

  eliminarEntrada(Id: any) {
    return this.http.delete<any[]>(`${this.url}delete/${Id}`)
  }

}
