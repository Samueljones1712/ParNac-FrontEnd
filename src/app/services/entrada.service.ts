import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Entrada } from '../interface/entrada';
import { Router } from '@angular/router';
import { view_entrada } from 'src/app/interface/view_entradas';

@Injectable({
  providedIn: 'root'
})
export class EntradaService {

  private url = "http://localhost:4000/Entradas/";

  constructor(private http: HttpClient) { }

  getEntradas(): Observable<view_entrada[]> {

    return this.http.get<view_entrada[]>(`${this.url}`)

  }

  addEntrada(entrada: Entrada) {
    return this.http.post<any[]>(`${this.url}add`, entrada)
  }

  updateEntrada(entrada: Entrada) {
    return this.http.put<any[]>(`${this.url}actualizar`, entrada)
  }

  eliminarEntrada(Id: any) {
    return this.http.delete<any[]>(`${this.url}delete/${Id}`)
  }

}
