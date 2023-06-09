import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { LoginConnectionService } from 'src/app/services/login-connection.service';
import { User } from 'src/app/interface/user';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from 'src/app/utils/alert.service';
import { IpServiceService } from 'src/app/services/ip-service.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading: boolean = false;

  publicIpAddress: string = "";

  datos: any[] = [];

  usuario: User = { id: "", nombre: '', apellido: '', correo: "", contrasena: "", salt: '', tipo: "", identificacion: "" };

  constructor(private LoginConnection: LoginConnectionService, private router: Router,
    private toastr: ToastrService, private alert: AlertService, private ipService: IpServiceService, private userService: UserService) { }

  ngOnInit(): void {

    this.ipService.getPublicIpAddress().then(ip => {
      this.publicIpAddress = ip;
      console.log('Dirección IP pública:', ip);
      sessionStorage.setItem("IP", this.publicIpAddress);
    });

  }

  loginForm = new FormGroup({
    correo: new FormControl("", [Validators.required, Validators.maxLength(70)]),
    password: new FormControl("", [Validators.required, Validators.maxLength(70)])
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

          // console.log(res.response.result.information);

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


  getMyUser(): Promise<void> {

    return new Promise<void>((resolve, reject) => {
      this.userService.getUserByCorreo(sessionStorage.getItem('correo') + '').subscribe((res: any) => {

        sessionStorage.setItem('myID', res[0].id);

        sessionStorage.setItem('myName', res[0].nombre + " " + res[0].apellido);
        // console.log(this.listUsuario);
        resolve();
      },
        (error) => {

          reject(error);
        });
    })
  }

}
