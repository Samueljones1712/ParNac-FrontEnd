import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegistroActividad, RegistroActividadVista } from '../interface/RegistroActividad';

@Injectable({
  providedIn: 'root'
})
export class ControlInternoService {



  private url = "http://localhost:4000/control/";

  constructor(private http: HttpClient) { }

  addRegistro(registro: RegistroActividad) {
    return this.http.post<any[]>(`${this.url}add`, registro)
  }

  getRegistro(): Observable<RegistroActividadVista[]> {
    return this.http.get<RegistroActividadVista[]>(`${this.url}`)
  }
}
