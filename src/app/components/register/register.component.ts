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
  confirmPassword: string = "";
  cedula: string = "";
  padron: Padron = { apellido1: "", apellido2: "", cedula: "", nombre: "" }
  usuario: User = { id: "", nombre: '', apellido: '', correo: "", contrasena: "", salt: '', tipo: "" };

  registerForm: FormGroup = new FormGroup({});

  ngOnInit(): void {
    this.Toastr.info("La cedula no debe tener espacios, ni separadores.", "Nacional.")
    this.Toastr.info("La Ingresar el pasaporte.", "Extranjero.")
    this.loadForm();
  }

  constructor(private LoginConnection: LoginConnectionService, private userService: UserService, private router: Router, private Toastr: ToastrService) { }

  cargarData(e: any): void {



    let cedula = e.target.value;

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

  loadForm() {
    this.registerForm = new FormGroup({
      cedula: new FormControl(this.padron.cedula, Validators.required),
      nombre: new FormControl(this.padron.nombre, Validators.required),
      apellido: new FormControl(this.padron.apellido1, Validators.required),
      correo: new FormControl("", [Validators.required]),
      contrasena: new FormControl("", [Validators.required])
    });
  }

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

    console.log(this.registerForm.value.contrasena + " == " + this.confirmPassword)

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
