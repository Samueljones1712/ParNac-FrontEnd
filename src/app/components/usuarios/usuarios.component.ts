import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';


import { User } from 'src/app/interface/user';
import { UserService } from 'src/app/services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  loading: boolean = false;
  listUsers: User[] = [];

  usuario: User = {
    id: "", nombre: "", apellido: "",
    contrasena: "", correo: "", salt: "", tipo: ""
  }

  nuevaContrasena: string = "";
  confirmarNuevaContrasena: string = "";
  correo: string = "";
  id: string = "";
  mostrarFormClave: boolean = false;

  constructor(private userService: UserService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.getUser();

    this.dtOptions = {
      pagingType: 'full_numbers',
      searching: true,
      lengthChange: true,
      language: {
        searchPlaceholder: 'Por nombre de usuario',
        url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'
      }
    }
  }

  getUser() {
    this.loading = true;
    this.userService.getUser().subscribe((res: User[]) => {

      this.loading = false
      this.listUsers = res;
      console.log(res);

    });
  }

  loadChangePassword(id: any) {

    this.usuario = this.listUsers[id - 1];
    this.correo = this.usuario.correo;
    this.id = this.usuario.id;

    this.mostrarFormClave = true;
  }

  eliminar(id: any) {

    this.loading = true;
    this.toastr.info("Eliminando el Usuario", "Eliminando...");
    this.userService.deleteUser(id).subscribe((res: any) => {
      this.toastr.success('Se elimino el Usuario', 'Correcto');
      this.ngOnInit();
    });

  }

  saveNewPassword() {

    console.log(this.confirmarNuevaContrasena + "==" + this.nuevaContrasena);

    if (this.confirmarNuevaContrasena != this.nuevaContrasena) {

      this.toastr.error("Las contrasenas no coinciden.", "Error");

    } else {

      this.mostrarFormClave = false;
      this.loading = true;

      this.usuario = { id: this.id, nombre: "", apellido: "", correo: "", salt: "", contrasena: this.nuevaContrasena, tipo: "" }

      this.userService.changePassword(this.usuario).subscribe((res: any) => {

        this.loading = false
        console.log(res);

      })
    }

  }



}