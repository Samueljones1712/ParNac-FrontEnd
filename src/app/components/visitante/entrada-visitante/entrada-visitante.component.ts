import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Entrada } from 'src/app/interface/entrada';
import { EntradaService } from 'src/app/services/entrada.service';
import { ParkService } from 'src/app/services/park.service';
import { parkNational } from 'src/app/interface/parkNational';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interface/user';
import { error } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

import { RegistroActividad } from 'src/app/interface/RegistroActividad';
import { ControlInternoService } from 'src/app/services/control-interno.service';

@Component({
  selector: 'app-entrada-visitante',
  templateUrl: './entrada-visitante.component.html',
  styleUrls: ['./entrada-visitante.component.css']
})
export class EntradaVisitanteComponent implements OnInit {

  minDate: string = "";
  Id: string = "";

  registro: RegistroActividad = {
    detalle: "", fechaHora: "", id: 0, ipAddress: "", pk_idUsuario: 0
  }

  cantidadActual=0;

  loading: boolean = true;
  subtotalN: number = 0;
  totalN: number = 0;
  ivaN: number = 13;

  subtotalE: number = 0;
  totalE: number = 0;
  ivaE: number = 13;
  ivaPorcentaje: number = 13;

  entrada: Entrada = {
    fecha: "",
    fk_idUsuario: "",
    fk_idParque: "",
    estado: "",
    id: 0,
    fechaVencimiento: "",
    CantExtranjeros: 0,
    CantNacionales: 0,
    tarifaNacionales: 0,
    tarifaExtranjeros: 0,
    hora: ""
  }

  usuario: User = {
    apellido: "",
    contrasena: "",
    correo: "",
    id: "",
    identificacion: "",
    nombre: "",
    salt: "",
    tipo: ""
  }

  park: parkNational = {
    Area_de_Conservacion: "",
    horario: "",
    Id: 0,
    maxVisitantes: 0,
    imagen: "", Nombre: "",
    Provincia: "",
    Tarifa_Extranjeros_dolares: 0,
    Tarifa_Nacionales_colones: 0
  }

  entradaForm: FormGroup = new FormGroup({
    CantExtranjeros: new FormControl(0, []),
    CantNacionales: new FormControl(0, []),
    grupo: new FormControl("Grupo 01: Entrada 08:00 am", [Validators.required]),
    fechaVencimiento: new FormControl("", [Validators.required]),
  });


  constructor(private route: ActivatedRoute, private parkService: ParkService,
    private userService: UserService, private entradaService: EntradaService, private Toastr: ToastrService, private controlService: ControlInternoService, private router:Router) {

    const today = new Date();
    this.minDate = this.formatDate(today);
    this.getParkNational();

  }

  ngOnInit() {

    this.Id = this.route.snapshot.paramMap.get('Id') ?? '';
    this.loadInformation();

  }

  loadInformation() {
    this.getParkNational().then(() => {
      this.getUser().then(() => {

        this.loading = false;

      });
    });
  }

  getEntrada() {

    if (this.entradaForm.value.fechaVencimiento != "") {

      if (this.entrada.CantNacionales > 0 || this.entrada.CantExtranjeros > 0) {

        Swal.fire({
          icon: 'warning',
          title: '¿Desea reservar en este Parque Nacional?',
          showDenyButton: true,
          confirmButtonText: 'Sí',
          denyButtonText: 'No'
        }).then((result) => {
          if (result.isConfirmed) {

            this.loadEntradaWithForm();
            this.saveEntrada().then((resolve) => {
              this.Toastr.success("Se reservó correctamente la entrada.", "Correcto.");
              setTimeout(() => {
                location.reload();
              }, 5000);
            }, (error) => {
              this.Toastr.error("No se pudo reservar la entrada.", "Error.");
            });



          } else if (result.isDenied) {
            this.Toastr.info("Se ha cancelado la acción");
          }
        })

      } else {
        this.Toastr.info("Seleccione la cantidad de Personas.");
        return;

      }
    } else {
      this.Toastr.info("Seleccione una fecha.");
      return;
    }

  }

  loadEntradaWithForm() {
    this.entrada.hora = this.entradaForm.value.grupo;
    this.entrada.fechaVencimiento = this.entradaForm.value.fechaVencimiento + "";
    this.entrada.fk_idParque = this.park.Id + "";
    this.entrada.fk_idUsuario = this.usuario.id;
    this.entrada.fecha = this.minDate;
    this.entrada.estado = "Activo";
    this.entrada.tarifaExtranjeros = this.totalE;
    this.entrada.tarifaNacionales = this.totalN;
  }

  saveEntrada(): Promise<void> {

    this.loading = true;


    return new Promise<void>((resolve, reject) => {
      this.parkService.getParkNational(this.entrada.fk_idParque).subscribe((res: any) => {
        this.park = res[0];
      })
      var cantidadMax = this.park.maxVisitantes;

      this.entradaService.getEntradasTotalesParque(this.entrada).subscribe((res: any) => {
         this.cantidadActual = res[0];
      })
   
      
      var total=parseInt(this.entrada.CantExtranjeros+"")+parseInt(this.entrada.CantNacionales+"");


      console.log((cantidadMax-this.cantidadActual));
      console.log(total);
      if((total)<(cantidadMax-this.cantidadActual)){
        this.entradaService.addEntrada(this.entrada).subscribe((res: any) => {
          console.log(res);
          this.createEntradaRegistro("Inserto en la tabla Entrada");
  
          resolve();
        }, (error) => {
          reject(error);
        });
      }else{
        Swal.fire({
          icon:"error",
          title:"La cantidad de entradas excede el máximo diario",
          text:"Cantidad de entradas disponibles: "+(cantidadMax-this.cantidadActual)
        })
      }
      this.router.navigate(['index-visitante']);
    });
    
  }

  getUser(): Promise<void> {

    return new Promise<void>((resolve, reject) => {

      this.userService.getUserByCorreo(sessionStorage.getItem('correo')).subscribe((res: any) => {
        this.usuario = res[0];
        resolve();
      }, (error) => {
        reject(error);
      });
    });
  }

  getParkNational(): Promise<void> {

    return new Promise<void>((resolve, reject) => {

      this.parkService.getParkNational(this.Id).subscribe((res: any) => {
        this.park = res[0];
        resolve();
      }, (error) => {
        reject(error);
      });
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  agregar() {

    this.getEntrada()
  }
  cargarTotalExtranjero(e: any): void {

    this.entrada.CantExtranjeros = e.target.value;

    this.subtotalE = (this.entrada.CantExtranjeros * this.park.Tarifa_Extranjeros_dolares);

    this.ivaE = ((this.subtotalE * this.ivaPorcentaje) / 100);

    this.totalE = this.subtotalE + this.ivaE;

    this.totalE = parseFloat(this.totalE.toFixed(2));

  }


  cargarTotalNacional(e: any): void {

    this.entrada.CantNacionales = e.target.value;

    this.subtotalN = (this.entrada.CantNacionales * this.park.Tarifa_Nacionales_colones);

    this.ivaN = ((this.subtotalN * this.ivaPorcentaje) / 100);

    this.totalN = this.subtotalN + this.ivaN;

    this.totalN = parseFloat(this.totalN.toFixed(2));

  }

  createEntradaRegistro(tipo: string) {

    this.registro = {
      detalle: tipo, fechaHora: this.minDate + "",
      id: 0,
      ipAddress: sessionStorage.getItem("IP") + "",
      pk_idUsuario: parseInt(this.usuario.id)
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

}


