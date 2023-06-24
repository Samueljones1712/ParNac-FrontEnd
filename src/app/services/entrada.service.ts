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


  sendEntradaByCorreo(cantidad: number, fechaVencimiento: string, nombreParque: string, id: string) {

    const body = {
      correo: sessionStorage.getItem("correo"),
      cantidad: cantidad,
      fechaVencimiento: fechaVencimiento,
      nombreParque: nombreParque,
      fechaGenerada: id
    };

    return this.http.post<any[]>(`${this.url}SendCorreo`, body)
  }

  getEntradas(): Observable<view_entrada[]> {

    return this.http.get<view_entrada[]>(`${this.url}`)

  }

  getEntradaByDate(fechas: string[]) {
    return this.http.post<view_entrada[]>(`${this.url}getByDate`, fechas);
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
  getEntradasTotalesParque(entrada: Entrada) {
    const body = {
      fk_idParque: entrada.fk_idParque,
      fechaVencimiento: entrada.fechaVencimiento,
    };
    return this.http.post<any[]>(`${this.url}getEntradasParque`, body)
  }
}
