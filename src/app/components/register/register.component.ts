import { Component, Inject } from '@angular/core';
import { LoginConnectionService } from 'src/app/services/login-connection.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/interface/user';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  confirmPassword: string = "";
  usuario: User = { id: "", cedula: "", nombre: '', apellido: '', correo: "", contrasena: "", token: '', salt: '' };

  constructor(private LoginConnection: LoginConnectionService, private router: Router) { }

  registerForm = new FormGroup({
    cedula: new FormControl('', Validators.required),
    nombre: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    correo: new FormControl("", [Validators.required]),
    contrasena: new FormControl("", [Validators.required])
  });




  onRegister() {

    console.log(this.registerForm.value.contrasena + " == " + this.confirmPassword)

    if (this.registerForm.value.contrasena + "" == this.confirmPassword + "") {

      this.usuario.cedula = this.registerForm.value.cedula + "";
      this.usuario.nombre = this.registerForm.value.nombre + "";
      this.usuario.apellido = this.registerForm.value.apellido + "";
      this.usuario.correo = this.registerForm.value.correo + "";
      this.usuario.contrasena = this.registerForm.value.contrasena + "";

      this.LoginConnection.register(this.usuario).subscribe((res: any) => {

        if (res.response.status == "ok") {

          Swal.fire('Usuario registrado!', '', 'success')

          this.router.navigate(['login'])
        } else {
          Swal.fire('Error al registrar el usuario!', '', 'error')
        }
      });
    }

  }



}
