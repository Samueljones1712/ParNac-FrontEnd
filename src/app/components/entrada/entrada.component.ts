import { Component, OnInit } from '@angular/core';
import { Entrada } from 'src/app/interface/entrada';
import { EntradaService } from 'src/app/services/entrada.service';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ToastrService } from 'ngx-toastr';
import { ParkService } from 'src/app/services/park.service';
import { parkNational } from 'src/app/interface/parkNational';
import { Administrador, UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interface/user';

@Component({
  selector: 'app-entrada',
  templateUrl: './entrada.component.html',
  styleUrls: ['./entrada.component.css']
})
export class EntradaComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  loading: boolean = false;
  loadingParks: boolean = false;
  loadingCedula: boolean = false;

  listEntradas: Entrada[] = []
  listAdmins: Administrador[] = [];

  id: string = "";
  fk_idParque: String = "";
  nombreParque: String = "";
  nombreCedula: String = "";
  cedula: String = "";
  tarifa: String = "";
  valueDelete: string = "";

  listParks: parkNational[] = [];

  entradaForm: FormGroup = new FormGroup({});

  entrada: Entrada = {
    fecha: "",
    fk_idParque: "",
    fk_cedula: "",
    estado: "",
    id: "",
    fechaVencimiento: "",
    tarifa: ""
  }



  ngOnInit(): void {


    this.loadForm();
    this.getEntrada();

    this.loadParkes();


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
    private toastr: ToastrService, private parkService: ParkService, private userService: UserService) { }

  savePark(e: any): void {
    let name = e.target.value;

    let list = this.listParks.filter(x => x.Nombre === name)[0];

    //this.toastr.success("Has seleccionado el Parque:" + list.Nombre, "Correcto");

    this.tarifa = list.Tarifa_Nacionales_colones;

    this.nombreParque = list.Nombre;

    this.fk_idParque = list.Id;

    this.loadingParks = false;

    this.loadCedula();
  }

  saveCedula(a: any): void {
    let name = a.target.value;

    this.cedula = name;

    let list = this.listAdmins.filter(x => x.cedula === name)[0];
    this.nombreCedula = list.nombre + " " + list.apellido;
    //this.toastr.success("Has seleccionado la cedula:" + this.cedula, "Correcto");

    this.loadingCedula = false;

    this.loadingParks = true;

  }

  loadForm() {
    this.entradaForm = new FormGroup({
      id: new FormControl(this.entrada.id),
      //   fecha: new FormControl(this.entrada.fecha, [Validators.required]),
      estado: new FormControl(this.entrada.estado, [Validators.required]),
      fechaVencimiento: new FormControl(this.entrada.fechaVencimiento, [Validators.required])
    });
  }

  loadCedula() {

    this.loadingCedula = true;
    this.userService.getViewAdministradores().subscribe((res: Administrador[]) => {

      this.listAdmins = res;

      console.log(this.listAdmins);

    });
  }

  loadParkes() {

    this.loadingParks = true;

    this.parkService.getParkNationals().subscribe((res: parkNational[]) => {
      this.listParks = res;

    })
  }


  agregar() {

    console.log(this.entradaForm.value.id);

    this.toastr.info("Espera", "Guardando...");

    if (this.entradaForm.value.id == "") {

      this.setEntradaWithForm();

      this.loading = true;

      this.entradaService.addEntrada(this.entrada).subscribe((res: any) => {
        console.log(res.response.status);
        this.loading = false;

        if (res.response.status == "ok") {
          this.toastr.success("Se guardo la entrada", "Correcto.");
          this.ngOnInit();
          this.nombreCedula = "";
          this.nombreParque = "";
          this.cedula = "";
          this.fk_idParque = "";
        } else {
          this.toastr.error("Error al guardar la entrada", "Error.");
        }

      });

      this.cleanEntrada();

    } else {

      this.setEntradaWithForm();

      this.entradaService.updateEntrada(this.entrada).subscribe((res: any) => {


      });

      this.cleanEntrada();
    }
  }

  getEntradaById(id: any) {
    for (var i = 0; i < this.listEntradas.length; i++) {
      if (this.listEntradas[i].id == id) {
        this.entrada = this.listEntradas[i];
      }
    }
  }

  loadActualizar(Id: any) {

    this.getEntradaById(Id);

    this.loadForm();

    this.toastr.info("Se cargo la informacion", "Correcto.");

  }





  eliminar(Id: any) {

    this.getEntradaById(Id);

    if (this.entrada.estado != "Cancelada") {

      this.loading = true;

      this.entradaService.eliminarEntrada(Id).subscribe((res: any) => {
        this.ngOnInit();
      });
    } else {

      this.toastr.error("Entrada ya cancelada.", "Error.");

    }
  }

  getEntrada() {
    this.loading = true;
    this.entradaService.getEntrada().subscribe((res: Entrada[]) => {

      this.loading = false
      this.listEntradas = res;

    });

  }

  cleanEntrada() {
    this.entrada = {
      fecha: "",
      fk_idParque: "",
      fk_cedula: "",
      estado: "",
      id: "",
      fechaVencimiento: "",
      tarifa: ""
    }

    this.loadForm();
  }

  setEntradaWithForm() {
    if (this.fk_idParque + "" != "") {
      this.entrada.fecha = this.entradaForm.value.fecha + "";
      this.entrada.fk_idParque = this.fk_idParque + "";
      this.entrada.fk_cedula = this.cedula + "";
      this.entrada.estado = this.entradaForm.value.estado + "";
      this.entrada.fechaVencimiento = this.entradaForm.value.fechaVencimiento + "";
      this.entrada.tarifa = this.tarifa + "";
    } else {

      this.toastr.error("Asegurese de seleccionar el Parque Nacional", "Incompleto");

    }

  }
}