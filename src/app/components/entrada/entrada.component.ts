import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { Entrada } from 'src/app/interface/entrada';
import { EntradaService } from 'src/app/services/entrada.service';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ParkService } from 'src/app/services/park.service';
import { parkNational } from 'src/app/interface/parkNational';
import { Administrador, UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interface/user';
import { view_entrada } from 'src/app/interface/view_entradas';

import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'
import { ControlInternoService } from 'src/app/services/control-interno.service';
import { RegistroActividad } from 'src/app/interface/RegistroActividad';
import { isNullOrUndefined } from '@swimlane/ngx-datatable';

//filtros
import * as moment from 'moment';
import 'moment/locale/es';
import { DataTableDirective } from 'angular-datatables';

import { formatDate } from '@angular/common';

@Component({
  selector: 'app-entrada',
  templateUrl: './entrada.component.html',
  styleUrls: ['./entrada.component.css']
})
export class EntradaComponent implements OnInit {

  @ViewChild('myInput', { static: false }) myInput!: ElementRef;

  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;

  registro: RegistroActividad = {
    detalle: "", fechaHora: "", id: 0, ipAddress: "", pk_idUsuario: 0
  }

  myID: number = (parseInt(sessionStorage.getItem("myID") + ""));

  minDate: string = "";
  idEntrada: number = 0;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  filterStartDate: string = '';
  filterEndDate: string = '';

  loading: boolean = true;
  isReadOnly: boolean = false;
  userSelected: boolean = false;
  parkSelected: boolean = false;

  listEntradas: view_entrada[] = [];
  listParques: parkNational[] = [];
  listUsuario: User[] = [];

  entradas: Entrada[] = [];

  fk_idParque: string = "";
  fk_idUsuario: string = "";
  myUser: User = {
    id: "", nombre: "", apellido: "", contrasena: "", correo: "", salt: "", tipo: "", identificacion: ""
  }
  usuario: User = {
    id: "", nombre: "", apellido: "", contrasena: "", correo: "", salt: "", tipo: "", identificacion: ""
  }

  entrada: Entrada = {
    fecha: "", fk_idUsuario: "", fk_idParque: "", estado: "", id: 0, fechaVencimiento: "", CantExtranjeros: 0,
    CantNacionales: 0, tarifaNacionales: 0, tarifaExtranjeros: 0, hora: ""
  }

  entradaView: view_entrada = {
    cantidadExtranjeros: 0, cantidadNacionales: 0, correo: "", estado: "", fecha: "", fechaVencimiento: "",
    fk_idParque: "", fk_idUsuario: "", hora: "", id: 0, Nombre: "", totalExtranjeros: 0, totalNacionales: 0
  }

  parque: parkNational = {
    Area_de_Conservacion: "", horario: "", Id: 0, maxVisitantes: 0, Nombre: "", Provincia: "", Tarifa_Extranjeros_dolares: 0, Tarifa_Nacionales_colones: 0, imagen: ""
  }


  subtotalN: number = 0;
  totalN: number = 0;
  ivaN: number = 13;

  subtotalE: number = 0;
  totalE: number = 0;
  ivaE: number = 13;
  ivaPorcentaje: number = 13;

  entradaForm: FormGroup = new FormGroup({
    CantExtranjeros: new FormControl(0, [Validators.min(0), Validators.max(100)]),
    CantNacionales: new FormControl(0, [Validators.min(0), Validators.max(100)]),
    grupo: new FormControl("Grupo 01: Entrada 08:00 am", [Validators.required]),
    fechaVencimiento: new FormControl(this.minDate, [Validators.required]),
  });


  ngOnInit(): void {
    console.log(sessionStorage.getItem("IP") + "");
    this.getEntradas().then((resolve) => {
      this.getParques().then((resolve) => {
        this.getUsuarios().then((resolve) => {

          if (isNaN(this.myID)) {
            this.getMyUser().then((resolve) => {
              this.loading = false;

            })
          } else {
            this.loading = false;
          }
        });
      });
    });

    this.dtOptions = {
      pagingType: 'full_numbers',
      searching: true,
      lengthChange: true,
      language: {
        searchPlaceholder: 'Por fecha de entrada',
        url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'
      }
    }


  }

  displayStyle="none";
  openPopup(){
    this.displayStyle="block";
  }
  closePopup(){
    this.displayStyle="none";
  }

  constructor(private entradaService: EntradaService, private router: Router,
    private Toastr: ToastrService, private parkService: ParkService, private userService: UserService,
    private controlService: ControlInternoService) {

    const today = new Date();
    this.minDate = this.formatDate(today);

  }

  /*Filtro */

  applyDateRangeFilter() {

    if (this.filterStartDate != "" && this.filterEndDate != "") {
      console.log(this.filterStartDate + " - " + this.filterEndDate);

      const fechas = [this.filterStartDate, this.filterEndDate];

      this.entradaService.getEntradaByDate(fechas).subscribe((res: view_entrada[]) => {
        this.listEntradas = res;
      })
    }
  }

  graficar() {

  }

  /*Fin del filtro*/

  getParques(): Promise<void> {

    return new Promise<void>((resolve, reject) => {
      this.parkService.getParkNationals().subscribe(
        (res: parkNational[]) => {
          this.listParques = res;

          // console.log(this.listParques);
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

          // console.log(this.listUsuario);
          resolve();
        },
        (error) => {

          reject(error);
        });
    })
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



  getParque(Id: any): Promise<void> {

    return new Promise<void>((resolve, reject) => {
      this.parkService.getParkNational(Id).subscribe(
        (res: parkNational) => {
          this.parque = res;
          // console.log(this.parque);
          this.loading = false;
          resolve();
        },
        (error) => {
          this.loading = false;
          reject(error);
        });
    })
  }

  formattedDate(fechaFea: string) {
    const fecha = new Date(fechaFea);
    const anio = fecha.getFullYear();
    const mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
    const dia = ('0' + fecha.getDate()).slice(-2);
    const fechaFormateada = `${dia}/${mes}/${anio}`;

    return fechaFormateada;
  }

  getEntradas(): Promise<void> {

    return new Promise<void>((resolve, reject) => {
      this.entradaService.getEntradas().subscribe(
        (res: view_entrada[]) => {

          for (let index = 0; index < res.length; index++) {

            res[index].fechaVencimiento = this.formattedDate(res[index].fechaVencimiento);
            res[index].fecha = this.formatDateTime(res[index].fecha);
          }

          this.listEntradas = res;

          resolve();
        },
        (error) => {

          reject(error);
        });
    })
  }
  selectPark(e: any): void {
    let nombre = e.target.value;

    this.parque = this.listParques.filter(parque => parque.Nombre === nombre)[0];

    this.Toastr.success("Has seleccionado el Parque: " + nombre, "Correcto");

    this.parkSelected = true;
  }

  selectUser(e: any): void {
    let correo = e.target.value;

    this.usuario = this.listUsuario.filter(usuario => usuario.correo === correo)[0];

    this.Toastr.success("Has seleccionado el Usuario: " + correo, "Correcto");
    this.userSelected = true;

  }


  cargarTotalExtranjero(e: any): void {

    this.entrada.CantExtranjeros = e.target.value;

    this.subtotalE = (this.entrada.CantExtranjeros * this.parque.Tarifa_Extranjeros_dolares);

    this.ivaE = ((this.subtotalE * this.ivaPorcentaje) / 100);

    this.totalE = this.subtotalE + this.ivaE;

    this.totalE = parseFloat(this.totalE.toFixed(2));

  }

  cargarTotalNacional(e: any): void {

    this.entrada.CantNacionales = e.target.value;

    this.subtotalN = (this.entrada.CantNacionales * this.parque.Tarifa_Nacionales_colones);

    this.ivaN = ((this.subtotalN * this.ivaPorcentaje) / 100);

    this.totalN = this.subtotalN + this.ivaN;

    this.totalN = parseFloat(this.totalN.toFixed(2));

  }


  loadEntradaWithForm() {
    if (this.idEntrada != 0) {//Es un update
      this.entrada.id = this.idEntrada;
    }

    this.entrada.hora = this.entradaForm.value.grupo;
    this.entrada.fechaVencimiento = this.entradaForm.value.fechaVencimiento + "";
    this.entrada.fk_idParque = this.parque.Id + "";
    this.entrada.fk_idUsuario = this.usuario.id;
    this.entrada.fecha = this.minDate;
    this.entrada.estado = "Activo";
    this.entrada.tarifaExtranjeros = this.totalE;
    this.entrada.tarifaNacionales = this.totalN;

  }



  updateEntrada(): Promise<void> {

    this.loading = true;

    return new Promise<void>((resolve, reject) => {

      this.entradaService.updateEntrada(this.entrada).subscribe((res: any) => {

        resolve();
      }, (error) => {
        reject(error);
      });
    });
  }


  saveEntrada(): Promise<void> {

    this.loading = true;

    return new Promise<void>((resolve, reject) => {

      this.entradaService.addEntrada(this.entrada).subscribe((res: any) => {

        resolve();
      }, (error) => {
        reject(error);
      });
    });
  }

  agregar() {
    Swal.fire({
      icon: 'warning',
      title: '¿Desea reservar en este Parque Nacional?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {



        this.loadEntradaWithForm();
        this.saveEntrada().then((resolve) => {
          this.Toastr.success("Se reservo correctamente la entrada.", "Correcto.");
          this.createEntradaRegistro("Inserto en la tabla Entrada");
          setTimeout(() => {
            location.reload();
          }, 5000);
        }, (error) => {
          this.Toastr.error("No se pudo reservar la entrada.", "Error.");
        });



      } else if (result.isDenied) {
        this.Toastr.info("Se ha cancelado la acción");
      }
    });

  }

  actualizarEntrada() {

    Swal.fire({
      icon: 'warning',
      title: '¿Desea actualizar la reservacion de este Parque Nacional?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {



        this.loadEntradaWithForm();
        this.updateEntrada().then((resolve) => {
          this.Toastr.success("Se actualizo correctamente la entrada.", "Correcto.");
          this.createEntradaRegistro("Actualizo en la tabla Entrada ");

          this.idEntrada = 0;

          setTimeout(() => {
            location.reload();
          }, 5000);
        }, (error) => {
          this.idEntrada = 0;
          this.Toastr.error("No se pudo actualizar la entrada.", "Error.");
        });

      } else if (result.isDenied) {
        this.idEntrada = 0;
        this.Toastr.info("Se ha cancelado la acción");
      }
    });


  }

  addEntrada() {

    console.log(this.entradaForm.value.fk_idUsuario);

    if (this.parkSelected == true) {

      if (this.userSelected == true) {

        if (this.entradaForm.value.fechaVencimiento != "") {

          if (this.entrada.CantNacionales > 0 || this.entrada.CantExtranjeros > 0) {

            if (this.idEntrada == 0) {//si es 0 es null
              this.agregar();

            } else {
              this.actualizarEntrada();
            }

          } else {
            this.Toastr.info("Seleccione la cantidad de Personas.");
            return;

          }
        } else {
          this.Toastr.info("Seleccione una fecha.");
          return;
        }

      } else {
        this.Toastr.info("Seleccione un usuario.");
        return;
      }
    } else {
      this.Toastr.info("Seleccione un parque.");
      return;
    }

  }

  eliminar(Id: any) {

    this.entradaView = this.listEntradas.filter(entrada => entrada.id === Id)[0];

    if (this.entradaView.estado == "Aprobada") {


      Swal.fire({
        icon: 'warning',
        title: '¿Desea actualizar la reservacion de este Parque Nacional?',
        showDenyButton: true,
        confirmButtonText: 'Si',
        denyButtonText: 'No'
      }).then((result) => {

        if (result.isConfirmed) {

          this.entradaService.eliminarEntrada(Id).subscribe((res: any) => {
            this.Toastr.success("Se desactivo la entrada.", "Correcto");

            this.createEntradaRegistro("Desactivo en la tabla Entrada ");

            setTimeout(() => {
              location.reload();
            }, 3000);

          });

        } else if (result.isDenied) {

          this.Toastr.info("Se ha cancelado la acción");
        }
      });

    } else {
      this.Toastr.error("La entrada ya esta desactivada.", "Error");
    }



  }

  loadActualizar(id: any) {

    this.idEntrada = id;

    this.isReadOnly = true;

    this.parkSelected = true;
    this.userSelected = true;

    this.entradaView = this.listEntradas.filter(entrada => entrada.id === id)[0];

    this.entrada.CantNacionales = this.entradaView.cantidadNacionales;
    this.entrada.CantExtranjeros = this.entradaView.cantidadExtranjeros;

    this.entradaForm = new FormGroup({
      CantExtranjeros: new FormControl(this.entradaView.cantidadExtranjeros, [Validators.min(0), Validators.max(100)]),
      CantNacionales: new FormControl(this.entradaView.cantidadNacionales, [Validators.min(0), Validators.max(100)]),
      grupo: new FormControl(this.entradaView.hora, [Validators.required]),
      fechaVencimiento: new FormControl(this.minDate, [Validators.required])
    });

    this.fk_idUsuario = this.entradaView.correo;
    this.fk_idParque = this.entradaView.Nombre;

    this.totalN = this.entradaView.totalNacionales;
    this.totalE = this.entradaView.totalExtranjeros;


    this.usuario = this.listUsuario.filter(usuario => usuario.correo === this.entradaView.correo)[0];
    this.parque = this.listParques.filter(parque => parque.Nombre === this.entradaView.Nombre)[0];

  }

  createEntradaRegistro(tipo: string) {

    this.registro = {
      detalle: tipo, fechaHora: this.minDate + "",
      id: 0,
      ipAddress: sessionStorage.getItem("IP") + "",
      pk_idUsuario: this.myID
    }

    this.controlService.addRegistro(this.registro).subscribe((res: any) => {
      console.log("Se guardo el Registro.");
    })

  }

  validateNumber(event: any) {
    const input = event.target;
    const value = input.value;
    if (value && +value < 0) {
      input.value = Math.abs(+value); // Convierte el número negativo en su valor absoluto
    }
  }

  validateID() {
    const inputElement: HTMLInputElement | null = document.querySelector('#fk_idUsuario');

    if (inputElement) {
      const inputValue: string = inputElement.value;
      // Resto del código de validación

      for (let index = 0; index < this.listParques.length; index++) {
        if (this.listParques[index].Nombre == inputValue) {
          this.userSelected = true;
        }
      }
    }
  }


  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${day}/${month}/${year}`;
  }
  private formatDateTime(fechaFea: string) {
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