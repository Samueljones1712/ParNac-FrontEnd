import { Component, OnInit } from '@angular/core';
import { ParkService } from 'src/app/services/park.service';
import { Router } from '@angular/router';
import { parkNational } from 'src/app/interface/parkNational';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

import { FormControl, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  loading: boolean = true;
  resultado: boolean = false;

  listParques: parkNational[] = []

  parkForm: FormGroup = new FormGroup({});

  parque: parkNational = {
    Id: "", Nombre: "",
    Provincia: "",
    Tarifa_Extranjeros_dolares: "",
    Tarifa_Nacionales_colones: "",
    Area_de_Conservacion: ""
  }

  constructor(private parkService: ParkService, private router: Router, private toastr: ToastrService) { }

  loadForm() {

    this.parkForm = new FormGroup({
      Id: new FormControl(this.parque.Id),
      Nombre: new FormControl(this.parque.Nombre, [Validators.required]),
      Provincia: new FormControl(this.parque.Provincia, [Validators.required]),
      Tarifa_Extranjeros_dolares: new FormControl(this.parque.Tarifa_Extranjeros_dolares, [Validators.required]),
      Tarifa_Nacionales_colones: new FormControl(this.parque.Tarifa_Nacionales_colones, [Validators.required]),
      Area_de_Conservacion: new FormControl(this.parque.Area_de_Conservacion, [Validators.required]),
    });
  }

  ngOnInit(): void {

    this.loadForm();
    this.getParquesNacionales();

    this.dtOptions = {
      pagingType: 'full_numbers',
      searching: true,
      lengthChange: true,
      language: {
        searchPlaceholder: 'Por nombres de parques',
        url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'
      }
    }


  }


  agregar() {

    console.log(this.parkForm.value.Id);

    if (this.parkForm.value.Id == "") {

      this.parque = this.setParqueWithForm();

      this.toastr.info("Guardando el Parque Nacional", "Cargando...");

      this.parkService.addParkNational(this.parque).subscribe((res: any) => {

        if (res.response.status == "ok") {

          this.toastr.success('Se guardo con exito el Parque Nacional', 'Correcto');

          this.cleanParque();
          this.setParqueWithForm();
          this.ngOnInit();

        } else {
          this.toastr.error(res.response, 'No se guardo el Parque Nacional');
        }
      });

    } else {

      this.parque = this.setParqueWithForm();

      this.loading = true;

      this.parkService.updateParkNational(this.parque).subscribe((res: any) => {

        console.log(res);

        if (res.response.status == "ok") {

          this.toastr.success('Se edito con exito el Parque Nacional', 'Correcto');

          this.cleanParque();
          this.setParqueWithForm();
          this.ngOnInit();

        } else {
          this.toastr.error(res.response, 'No se edito el Parque Nacional');
        }
      });

      this.ngOnInit();
    }
  }

  actualizar(Id: any) {

    this.parque = this.listParques[Id - 1];
    //    this.toastr.info("Se esta cargando el Parque Nacional", "Cargando el Parque Nacional...");
    this.toastr.info("Se cargo el Parque Nacional", "Correcto");
    this.loadForm();

  }

  eliminar(Id: any) {

    this.loading = true;
    this.toastr.info("Eliminando el Parque Nacional", "Eliminando...");
    this.parkService.eliminarParkNational(Id).subscribe((res: any) => {
      this.toastr.success('Se elimino el Parque Nacional', 'Correcto');
      this.ngOnInit();
    });

  }

  getParquesNacionales() {

    this.toastr.info("Cargando los Parques Nacionales", "Cargando...");
    this.loading = true;
    this.parkService.getParkNationals().subscribe((res: parkNational[]) => {

      this.loading = false
      this.listParques = res;
    })
  }

  cleanParque() {
    this.parque = {
      Id: "", Nombre: "",
      Provincia: "",
      Tarifa_Extranjeros_dolares: "",
      Tarifa_Nacionales_colones: "",
      Area_de_Conservacion: ""
    }

    this.loadForm();
    this.getParquesNacionales();
  }

  setParqueWithForm() {

    this.parque.Nombre = this.parkForm.value.Nombre + "";
    this.parque.Provincia = this.parkForm.value.Provincia + "";
    this.parque.Tarifa_Extranjeros_dolares = this.parkForm.value.Tarifa_Extranjeros_dolares + "";
    this.parque.Tarifa_Nacionales_colones = this.parkForm.value.Tarifa_Nacionales_colones + "";
    this.parque.Area_de_Conservacion = this.parkForm.value.Area_de_Conservacion + "";
    return this.parque;
  }


  redirectEntrada() {
    this.router.navigate(['entrada'])
  }

  redirectUsuarios() {
    this.router.navigate(['usuarios'])
  }

  reloadCurrentRoute() {
    this.router.navigate(['index'])
  }


}
