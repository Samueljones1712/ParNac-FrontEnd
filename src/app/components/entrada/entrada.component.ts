import { Component, OnInit } from '@angular/core';
import { Entrada } from 'src/app/interface/entrada';
import { EntradaService } from 'src/app/services/entrada.service';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ToastrService } from 'ngx-toastr';
import { ParkService } from 'src/app/services/park.service';
import { parkNational } from 'src/app/interface/parkNational';

@Component({
  selector: 'app-entrada',
  templateUrl: './entrada.component.html',
  styleUrls: ['./entrada.component.css']
})
export class EntradaComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  loading: boolean = false;

  listEntradas: Entrada[] = []

  id: string = "";
  fk_idParque: String = "";
  tarifa: String = "";

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

  constructor(private entradaService: EntradaService, private router: Router,
    private toastr: ToastrService, private parkService: ParkService) { }

  savePark(e: any): void {
    let name = e.target.value;

    let list = this.listParks.filter(x => x.Nombre === name)[0];


    this.tarifa = list.Tarifa_Nacionales_colones;

    this.fk_idParque = list.Id;
  }

  loadForm() {
    this.entradaForm = new FormGroup({
      id: new FormControl(this.entrada.id),
      fecha: new FormControl(this.entrada.fecha, [Validators.required]),
      fk_cedula: new FormControl(this.entrada.fk_cedula, [Validators.required]),
      estado: new FormControl(this.entrada.estado, [Validators.required]),
      fechaVencimiento: new FormControl(this.entrada.fechaVencimiento, [Validators.required])
    });
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

  agregar() {

    console.log(this.entradaForm.value.id);

    if (this.entradaForm.value.id == "") {

      this.setEntradaWithForm();

      this.loading = true;

      this.entradaService.addEntrada(this.entrada).subscribe((res: any) => {
        console.log(res.response.status);
        this.loading = false;

        if (res.response.status == "ok") {
          this.toastr.success("Se guardo la entrada", "Correcto.");
          this.ngOnInit();
        } else {
          this.toastr.error("Error al guardar la entrada", "Error.");
        }

      });

      this.cleanEntrada();

    } else {

      this.setEntradaWithForm();

      this.entradaService.updateEntrada(this.entrada).subscribe((res: any) => {
        alert("Hubo respuesta");
        console.log(res);
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

  loadParkes() {

    this.parkService.getParkNationals().subscribe((res: parkNational[]) => {
      this.listParks = res;
    })
  }



  eliminar(Id: any) {

    this.entradaService.eliminarEntrada(Id).subscribe((res: any) => {
      alert("Hubo respuesta");
      console.log(res);
    });
  }

  getEntrada() {
    this.loading = true;
    this.entradaService.getEntrada().subscribe((res: Entrada[]) => {

      this.loading = false
      this.listEntradas = res;
      console.log(res);

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
      this.entrada.fk_cedula = this.entradaForm.value.fk_cedula + "";
      this.entrada.estado = this.entradaForm.value.estado + "";
      this.entrada.fechaVencimiento = this.entradaForm.value.fechaVencimiento + "";
      this.entrada.tarifa = this.tarifa + "";
    } else {

      this.toastr.error("Asegurese de seleccionar el Parque Nacional", "Incompleto");

    }

  }
}