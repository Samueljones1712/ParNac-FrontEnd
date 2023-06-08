import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  waitMessage(message: string = "enviando codigo al correo.") {
    Swal.fire({ text: "Espera, " + message, icon: 'info' });
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
}
