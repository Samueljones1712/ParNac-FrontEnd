import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class IpServiceService {

  constructor() { }

  getPublicIpAddress(): Promise<string> {
    return axios.get('https://api.ipify.org?format=json')
      .then(response => response.data.ip)
      .catch(error => {
        console.error('Error al obtener la dirección IP pública:', error);
        return '';
      });
  }
}
