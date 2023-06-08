import { Component, Inject, OnInit } from '@angular/core';
import { LoginConnectionService } from 'src/app/services/login-connection.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/interface/user';
import Swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';
import { AlertService } from 'src/app/utils/alert.service';
import { Padron, UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  loading: boolean = false;
  cedulaError: boolean = false;
  confirmPassword: string = "";
  cedula: string = "";
  padron: Padron = { apellido1: "", apellido2: "", cedula: "", nombre: "" }
  usuario: User = { id: "", nombre: '', apellido: '', correo: "", contrasena: "", salt: '', tipo: "", identificacion: '' };

  registerForm: FormGroup = new FormGroup({});

  ngOnInit(): void {
    this.Toastr.info("La cedula no debe tener espacios, ni separadores.", "Los Nacionales.")
    this.Toastr.info("Deben ingresar el pasaporte.", "Los Extranjeros.")
    this.loadForm();
  }

  constructor(private LoginConnection: LoginConnectionService, private userService: UserService, private router: Router, private Toastr: ToastrService) { }

  cargarData(e: any): void {

    this.Toastr.info("Buscando en base de datos.", "Espera...");

    let cedula = e.target.value;

    this.clearForm();

    if (cedula.length < 8 || cedula.length > 15) {
      this.cedulaError = true;
    } else {

      this.cedulaError = false;

      if (parseInt(cedula)) {
        this.userService.getPadron(cedula).subscribe((res: any) => {

          this.padron = res[0];

          if (res[0] != undefined) {

            this.loadForm();

          } else {
            this.Toastr.error("La cedula no fue encontrada en el Padron.", "Error Persona no encontrada");
          }
        });
      } else {
        this.Toastr.info("En caso de ser Correcto ignore este mensaje.", "Se detectaron caracteres de Pasaporte");
      }

    }

  }

  loadForm() {
    this.registerForm = new FormGroup({
      cedula: new FormControl(this.padron.cedula, /*[Validators.max(13), Validators.min(9)]*/),
      nombre: new FormControl(this.padron.nombre, [Validators.max(40), Validators.min(3)]),
      apellido: new FormControl(this.padron.apellido1, [Validators.max(40), Validators.min(3)]),
      correo: new FormControl("", [Validators.required, Validators.email, Validators.minLength(10), Validators.maxLength(70)]),
      contrasena: new FormControl("", [Validators.minLength(10), Validators.maxLength(70)])
    });
  }

  clearForm() {
    this.registerForm = new FormGroup({
      cedula: new FormControl('', /*[Validators.max(13), Validators.min(9)]*/),
      nombre: new FormControl('', [Validators.maxLength(40), Validators.minLength(3)]/*[Validators.max(13), Validators.min(9)]*/),
      apellido: new FormControl('', [Validators.maxLength(60), Validators.minLength(3)]/*[Validators.max(40), Validators.min(9)]*/),
      correo: new FormControl("", [Validators.required, Validators.email, Validators.minLength(10), Validators.maxLength(70)]),
      contrasena: new FormControl("", [Validators.minLength(10), Validators.maxLength(70)])
    });
  }



  onRegister() {
    const email_expresion = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    const password_expresion = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/;

    if (this.registerForm.value.nombre.length < 3 || this.registerForm.value.nombre.length > 40 || this.registerForm.valid) {

      this.Toastr.error("Nombre invalido", "error");

      return;

    }

    if (this.registerForm.value.apellido.length < 3 || this.registerForm.value.apellido.length > 40) {

      this.Toastr.error("Apellido invalido", "error");

      return;

    }

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
      this.usuario.identificacion = this.registerForm.value.cedula + "";

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
