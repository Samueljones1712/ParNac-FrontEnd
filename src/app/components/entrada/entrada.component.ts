import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-entrada',
  templateUrl: './entrada.component.html',
  styleUrls: ['./entrada.component.css']
})
export class EntradaComponent implements OnInit {

  minDate: string = "";
  idEntrada: number = 0;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  loading: boolean = true;

  listEntradas: view_entrada[] = [];
  listParques: parkNational[] = [];
  listUsuario: User[] = [];

  entradas: Entrada[] = [];

  fk_idParque: string = "";
  fk_idUsuario: string = "";

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

    this.getEntradas().then((resolve) => {
      this.getParques().then((resolve) => {
        this.getUsuarios().then((resolve) => {
          this.loading = false;
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

  constructor(private entradaService: EntradaService, private router: Router,
    private toastr: ToastrService, private parkService: ParkService, private userService: UserService, private Toastr: ToastrService) {

    const today = new Date();
    this.minDate = this.formatDate(today);

  }


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


  getEntrada(): Promise<void> {

    return new Promise<void>((resolve, reject) => {
      this.entradaService.getEntradas().subscribe(
        (res: view_entrada[]) => {
          this.listEntradas = res;
          // console.log(this.listEntradas);
          this.loading = false;
          resolve();
        },
        (error) => {
          this.loading = false;
          reject(error);
        });
    })
  }

  getEntradas(): Promise<void> {

    return new Promise<void>((resolve, reject) => {
      this.entradaService.getEntradas().subscribe(
        (res: view_entrada[]) => {
          this.listEntradas = res;
          // console.log(this.listEntradas);

          resolve();
        },
        (error) => {

          reject(error);
        });
    })
  }
  selectPark(e: any): void {
    let nombre = e.target.value;

    console.log(nombre);

    this.parque = this.listParques.filter(parque => parque.Nombre === nombre)[0];

    this.toastr.success("Has seleccionado el Parque: " + nombre, "Correcto");
  }

  selectUser(e: any): void {
    let correo = e.target.value;

    console.log(correo);

    this.usuario = this.listUsuario.filter(usuario => usuario.correo === correo)[0];

    this.toastr.success("Has seleccionado el Usuario: " + correo, "Correcto");
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
    if (this.idEntrada != 0) {
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
            this.toastr.success("Se desactivo la entrada.", "Correcto");

            setTimeout(() => {
              location.reload();
            }, 3000);

          });

        } else if (result.isDenied) {

          this.Toastr.info("Se ha cancelado la acción");
        }
      });

    } else {
      this.toastr.error("La entrada ya esta desactivada.", "Error");
    }



  }

  loadActualizar(id: any) {

    this.idEntrada = id;

    this.entradaView = this.listEntradas.filter(entrada => entrada.id === id)[0];

    console.log(this.entradaView);

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

  // saveCedula(a: any): void {
  //   let name = a.target.value;

  //   this.cedula = name;

  //   let list = this.listAdmins.filter(x => x.cedula === name)[0];
  //   this.nombreCedula = list.nombre + " " + list.apellido;
  //   //this.toastr.success("Has seleccionado la cedula:" + this.cedula, "Correcto");

  //   this.loadingCedula = false;

  //   this.loadingParks = true;

  // }

  // loadForm() {
  //   this.entradaForm = new FormGroup({
  //     id: new FormControl(this.entrada.id),
  //     //   fecha: new FormControl(this.entrada.fecha, [Validators.required]),
  //     // estado: new FormControl(this.entrada.estado, [Validators.required]),
  //     fechaVencimiento: new FormControl(this.entrada.fechaVencimiento, [Validators.required])
  //   });
  // }

  // loadCedula(): Promise<void> {
  //   return new Promise<void>((resolve, reject) => {
  //     this.loadingCedula = true;
  //     this.userService.getViewAdministradores().subscribe(
  //       (res: Administrador[]) => {
  //         this.listAdmins = res;
  //         this.loadingCedula = false;
  //         console.log(this.listAdmins);
  //         resolve(); // Resuelve la promesa cuando la petición se completa
  //       },
  //       (error) => {
  //         this.loadingCedula = false;
  //         reject(error); // Rechaza la promesa si hay algún error en la petición
  //       }
  //     );
  //   });
  // }




  // agregar() {

  //   console.log(this.entradaForm.value.id);

  //   this.toastr.info("Espera", "Guardando...");

  //   if (this.entradaForm.value.id == "") {

  //     this.setEntradaWithForm();

  //     this.loading = true;

  //     this.entradaService.addEntrada(this.entrada).subscribe((res: any) => {
  //       console.log(res.response.status);
  //       this.loading = false;

  //       if (res.response.status == "ok") {
  //         this.toastr.success("Se guardo la entrada", "Correcto.");
  //         this.ngOnInit();
  //         this.nombreCedula = "";
  //         this.nombreParque = "";
  //         this.cedula = "";
  //         this.fk_idParque = "";
  //       } else {
  //         this.toastr.error("Error al guardar la entrada", "Error.");
  //       }

  //     });

  //     this.cleanEntrada();

  //   } else {

  //     this.setEntradaWithForm();

  //     this.entradaService.updateEntrada(this.entrada).subscribe((res: any) => {


  //     });

  //     this.cleanEntrada();
  //   }
  // }

  // loadParkes(): Promise<void> {
  //   return new Promise<void>((resolve, reject) => {
  //     this.loadingParks = true;
  //     this.parkService.getParkNationals().subscribe(
  //       (res: parkNational[]) => {
  //         this.listParks = res;
  //         this.loadingParks = false;
  //         resolve(); // Resuelve la promesa cuando la petición se completa
  //       },
  //       (error) => {
  //         this.loadingParks = false;
  //         reject(error); // Rechaza la promesa si hay algún error en la petición
  //       }
  //     );
  //   });
  // }

  // getEntradaById(id: any) {
  //   for (var i = 0; i < this.listEntradas.length; i++) {
  //     if (this.listEntradas[i].id == id) {
  //       this.entrada = this.listEntradas[i];
  //     }
  //   }
  // }

  // loadActualizar(Id: any) {

  //   this.getEntradaById(Id);

  //   this.loadForm();

  //   this.toastr.info("Se cargo la informacion", "Correcto.");

  // }









  // cleanEntrada() {
  //   this.entrada = {
  //     fecha: "",
  //     fk_idParque: "",
  //     fk_cedula: "",
  //     estado: "",
  //     id: "",
  //     fechaVencimiento: "",
  //     tarifa: "",
  //     parqueNombre: "",
  //     nombreUsuario: ""
  //   }

  //   this.loadForm();
  // }

  // setEntradaWithForm() {
  //   if (this.fk_idParque + "" != "") {
  //     this.entrada.fecha = this.entradaForm.value.fecha + "";
  //     this.entrada.fk_idParque = this.fk_idParque + "";
  //     this.entrada.fk_cedula = this.cedula + "";
  //     this.entrada.estado = this.entradaForm.value.estado + "";
  //     this.entrada.fechaVencimiento = this.entradaForm.value.fechaVencimiento + "";
  //     this.entrada.tarifa = this.tarifa + "";
  //     this.entrada.nombreUsuario = "";
  //     this.entrada.parqueNombre = "";
  //   } else {

  //     this.toastr.error("Asegurese de seleccionar el Parque Nacional", "Incompleto");

  //   }

  // }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}