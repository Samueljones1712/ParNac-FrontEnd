import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { LoginConnectionService } from 'src/app/services/login-connection.service';
import { User } from 'src/app/interface/user';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from 'src/app/utils/alert.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading: boolean = false;

  datos: any[] = [];

  usuario: User = { id: "", nombre: '', apellido: '', correo: "", contrasena: "", salt: '', tipo: "" };

  constructor(private LoginConnection: LoginConnectionService, private router: Router,
    private toastr: ToastrService, private alert: AlertService) { }

  ngOnInit(): void {

  }

  loginForm = new FormGroup({
    correo: new FormControl(""),
    password: new FormControl("")
  });

  redirectRegister() {
    this.router.navigate(['register'])
  }

  onLogin() {
    // Acceder a los valores de los campos
    const email_expresion = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    const password_expresion = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/;

    if (this.loginForm.value.correo == '' || this.loginForm.value.password == '') {

      this.toastr.error('Todos los campos son obligatorios', 'Error');

      return;

    } else {

      this.usuario.correo = this.loginForm.value.correo + "";
      this.usuario.contrasena = this.loginForm.value.password + "";

      this.loading = true;

      this.alert.waitMessage();

      this.LoginConnection.login(this.usuario).subscribe((res: any) => {

        this.loading = false;

        if (res.response.status == "ok") {

          this.alert.showMessage(res.response.result.information);

          console.log(res.response.result.information);

          sessionStorage.setItem('correo', res.response.result.information);

          sessionStorage.setItem('code', res.response.result.code);

          this.router.navigate(['verify']);

        } else {
          console.log(res.response.result.error_msg)
          this.alert.errorMessage(res.response.result.error_msg)
        }
      });;

    }
  }

}
