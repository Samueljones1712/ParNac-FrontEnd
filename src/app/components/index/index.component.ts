import { Component, OnInit } from '@angular/core';
import { ParkService } from 'src/app/services/park.service';
import { Router } from '@angular/router';
import { parkNational } from 'src/app/interface/parkNational';
import { Observable } from 'rxjs';

import { FormControl, FormGroup, Validators } from '@angular/forms'


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  listParques: parkNational[] = []

  parkForm: FormGroup = new FormGroup({});

  parque: parkNational = {
    Id: "", Nombre: "",
    Provincia: "",
    Tarifa_Extranjeros_dolares: "",
    Tarifa_Nacionales_colones: "",
    Tarifa_Nacionales_dolares: "",
    Area_de_Conservacion: ""
  }

  constructor(private parkService: ParkService, private router: Router) { }

  loadForm() {

    this.parkForm = new FormGroup({
      Id: new FormControl(this.parque.Id),
      Nombre: new FormControl(this.parque.Nombre, [Validators.required]),
      Provincia: new FormControl(this.parque.Provincia, [Validators.required]),
      Tarifa_Extranjeros_dolares: new FormControl(this.parque.Tarifa_Extranjeros_dolares, [Validators.required]),
      Tarifa_Nacionales_colones: new FormControl(this.parque.Tarifa_Nacionales_colones, [Validators.required]),
      Tarifa_Nacionales_dolares: new FormControl(this.parque.Tarifa_Nacionales_dolares, [Validators.required]),
      Area_de_Conservacion: new FormControl(this.parque.Area_de_Conservacion, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.loadForm();
    this.getParquesNacionales();
  }

  agregar() {

    if (this.parkForm.value.Id == "") {

      this.parque = this.setParqueWithForm();

      this.parkService.addParkNational(this.parque).subscribe((res: any) => {
        alert("Hubo respuesta");
        console.log(res);
      });

      this.cleanParque();

    } else {

      this.parque = this.setParqueWithForm();

      this.parkService.updateParkNational(this.parque).subscribe((res: any) => {
        alert("Hubo respuesta");
        console.log(res);
      });

      this.cleanParque();
    }
  }

  actualizar(Id: any) {

    this.parque = this.listParques[Id - 1];

    this.loadForm();

  }

  eliminar(Id: any) {

    this.parkService.eliminarParkNational(Id).subscribe((res: any) => {
      alert("Hubo respuesta");
      console.log(res);
    });

  }

  getParquesNacionales() {
    this.parkService.getParkNationals().subscribe((res: parkNational[]) => {
      this.listParques = res;
      console.log(this.listParques);

    })
  }

  cleanParque() {
    this.parque = {
      Id: "", Nombre: "",
      Provincia: "",
      Tarifa_Extranjeros_dolares: "",
      Tarifa_Nacionales_colones: "",
      Tarifa_Nacionales_dolares: "",
      Area_de_Conservacion: ""
    }

    this.loadForm();
  }

  setParqueWithForm() {
    this.parque.Nombre = this.parkForm.value.Nombre + "";
    this.parque.Provincia = this.parkForm.value.Provincia + "";
    this.parque.Tarifa_Extranjeros_dolares = this.parkForm.value.Tarifa_Extranjeros_dolares + "";
    this.parque.Tarifa_Nacionales_colones = this.parkForm.value.Tarifa_Nacionales_colones + "";
    this.parque.Tarifa_Nacionales_dolares = this.parkForm.value.Tarifa_Nacionales_dolares + "";
    this.parque.Area_de_Conservacion = this.parkForm.value.Area_de_Conservacion + "";


    return this.parque;

  }

  redirectEntrada() {
    this.router.navigate(['entrada'])
  }


}
