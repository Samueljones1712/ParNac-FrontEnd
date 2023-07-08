import { Component, OnInit } from '@angular/core';
import { ControlInternoService } from 'src/app/services/control-interno.service';
import { RegistroActividad, RegistroActividadVista } from 'src/app/interface/RegistroActividad';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interface/user';

import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-registro-actividad',
  templateUrl: './registro-actividad.component.html',
  styleUrls: ['./registro-actividad.component.css']
})
export class RegistroActividadComponent implements OnInit {

  loading: boolean = true;

  listUsuario: User[] = [];
  listRegistro: RegistroActividadVista[] = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();


  registro: RegistroActividad = {
    detalle: "", fechaHora: "", id: 0, ipAddress: "", pk_idUsuario: 0
  }

  constructor(private router: Router,
    private Toastr: ToastrService, private userService: UserService,
    private controlService: ControlInternoService) { }

  ngOnInit(): void {

    this.getUsuarios().then((resolve) => {
      this.getRegistro().then((resolve) => {

        this.loading = false;
      })
    })

    this.dtOptions = {
      pagingType: 'full_numbers',
      searching: true,
      lengthChange: true,
      language: {
        searchPlaceholder: 'Buscar Registro',
        url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'
      }
    }
  }

  getRegistro(): Promise<void> {

    return new Promise<void>((resolve, reject) => {
      this.controlService.getRegistro().subscribe(
        (res: RegistroActividadVista[]) => {
          for (let index = 0; index < res.length; index++) {

            res[index].fechaHora = this.formattedDate(res[index].fechaHora);

          }
          this.listRegistro = res;

          for (let i = 0; i < this.listRegistro.length; i++) {
            for (let j = 0; j < this.listUsuario.length; j++) {


              if (this.listRegistro[i].pk_idUsuario == parseInt(this.listUsuario[j].id)) {
                this.listRegistro[i].correo = this.listUsuario[j].correo;
                this.listRegistro[i].nombreCompleto = this.listUsuario[j].nombre + this.listUsuario[j].apellido;
              }
            }

          }

          console.log(this.listRegistro);

          resolve();
        },
        (error) => {
          reject(error);
        });
    })
  }

  getUsuarios(): Promise<void> {

    return new Promise<void>((resolve, reject) => {
      this.userService.getUsers().subscribe(
        (res: User[]) => {
          this.listUsuario = res;
          resolve();
        },
        (error) => {
          reject(error);
        });
    })
  }
  formattedDate(fechaFea: string) {
    const fecha = new Date(fechaFea);
    const anio = fecha.getFullYear();
    const mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
    const dia = ('0' + fecha.getDate()).slice(-2);
    const hora = ('0' + fecha.getHours()).slice(-2);
    const minutos = ('0' + fecha.getMinutes()).slice(-2);
    const fechaFormateada = `${dia}/${mes}/${anio}-${hora}:${minutos}`;

    return fechaFormateada;
  }
}

