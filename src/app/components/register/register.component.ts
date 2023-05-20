import { Component, Inject, OnInit } from '@angular/core';
import { LoginConnectionService } from 'src/app/services/login-connection.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/interface/user';
import Swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';
import { AlertService } from 'src/app/utils/alert.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  loading: boolean = false;
  confirmPassword: string = "";
  usuario: User = { id: "", nombre: '', apellido: '', correo: "", contrasena: "", salt: '', tipo: "" };

  registerForm: FormGroup = new FormGroup({});

  ngOnInit(): void {
    this.clearForm();
  }

  constructor(private LoginConnection: LoginConnectionService, private router: Router, private Toastr: ToastrService) { }

  clearForm() {
    this.registerForm = new FormGroup({
      cedula: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      correo: new FormControl("", [Validators.required]),
      contrasena: new FormControl("", [Validators.required])
    });
  }



  onRegister() {
    const email_expresion = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    const password_expresion = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/;

    console.log(this.registerForm.value.contrasena + " == " + this.confirmPassword)

    if (!email_expresion.test(this.registerForm.value.correo + "")) {
      this.Toastr.error('Correo electronico invalido', 'error')
      return
    }

    if (!password_expresion.test(this.registerForm.value.contrasena + "")) {
      this.Toastr.error('La contraseña no cumplen con los requisitos', 'error')
      return
    }
    if (this.registerForm.value.contrasena + "" == this.confirmPassword + "") {

      this.usuario.nombre = this.registerForm.value.nombre + "";
      this.usuario.apellido = this.registerForm.value.apellido + "";
      this.usuario.correo = this.registerForm.value.correo + "";
      this.usuario.contrasena = this.registerForm.value.contrasena + "";

      this.loading = true;

      this.Toastr.info("Enviando el Usuario", "Cargando...");

      this.LoginConnection.register(this.usuario).subscribe((res: any) => {

        this.loading = false;

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
