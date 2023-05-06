import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms'
import { LoginConnectionService } from 'src/app/services/login-connection.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  ngOnInit(): void {

  }

  constructor(private LoginConnection: LoginConnectionService, private router: Router) { }

  verifyForm = new FormGroup({
    codigo: new FormControl("")
  });



  onVerify() {
    // Acceder a los valores de los campos

    var code = this.verifyForm.value.codigo + "";

    if (code == localStorage.getItem("code")) {
      this.showMessage();
      this.router.navigate(['index']);
    } else {
      this.errorMessage();

    }

  }

  showMessage() {
    Swal.fire({ text: "Codigo Correcto", icon: 'success' });
  }

  errorMessage(message = "Codigo Incorrecto") {
    Swal.fire({
      text: "Revisa el correo.", icon: 'warning', title: message + ''
    });
  }


}
