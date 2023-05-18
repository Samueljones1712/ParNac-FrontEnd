import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { LoginConnectionService } from 'src/app/services/login-connection.service';
import { User } from 'src/app/interface/user';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  datos: any[] = [];

  usuario: User = { id: "", cedula: "", nombre: '', apellido: '', correo: "", contrasena: "", token: '', salt: '' };

  constructor(private LoginConnection: LoginConnectionService, private router: Router) { }

  ngOnInit(): void {

  }

  loginForm = new FormGroup({
    correo: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required])
  });

  redirectRegister() {
    this.router.navigate(['register'])
  }

  onLogin() {
    // Acceder a los valores de los campos

    this.usuario.correo = this.loginForm.value.correo + "";
    this.usuario.contrasena = this.loginForm.value.password + "";

    this.LoginConnection.login(this.usuario);


  }

}
