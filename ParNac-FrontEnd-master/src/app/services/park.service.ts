import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import Swal from 'sweetalert2'
import { Observable } from 'rxjs';
import { parkNational } from '../interface/parkNational';

@Injectable({
  providedIn: 'root'
})
export class ParkService {

  private token: string = '';

  private url = "http://localhost:4000/ParqueNacional/";
  swal: any;

  constructor(private http: HttpClient) { }

  getParkNationals(): Observable<parkNational[]> {
    //const token = sessionStorage.getItem('token');
    //const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    return this.http.get<parkNational[]>(`${this.url}`)

  }

  sendImg(formData: FormData) {
    return this.http.post('http://localhost:4000/api/upload', formData)
  }


  addParkNational(parkNational: any) {
    return this.http.post<any[]>(`${this.url}add`, parkNational)
  }

  updateParkNational(parkNational: any) {
    return this.http.put<any[]>(`${this.url}add`, parkNational)
  }

  eliminarParkNational(Id: any) {

    return this.http.delete<any[]>(`${this.url}delete/${Id}`)
  }

}
