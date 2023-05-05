import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms'
import { LoginConnectionService, User } from 'src/app/services/login-connection.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  datos: any[] = [];

  usuario: User = { id: "", nombre: '', apellido: '', correo: "", contrasena: "", token: '', salt: '' };

  constructor(private LoginConnection: LoginConnectionService) { }

  ngOnInit(): void {

  }

  loginForm = new FormGroup({
    correo: new FormControl(""),
    password: new FormControl("")
  });



  onLogin() {
    // Acceder a los valores de los campos

    this.usuario.correo = this.loginForm.value.correo + "";
    this.usuario.contrasena = this.loginForm.value.password + "";

    this.LoginConnection.login(this.usuario);


  }

}
