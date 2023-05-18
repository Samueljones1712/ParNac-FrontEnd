import { Component } from '@angular/core';
import { Entrada } from 'src/app/interface/entrada';
import { EntradaService } from 'src/app/services/entrada.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-entrada',
  templateUrl: './entrada.component.html',
  styleUrls: ['./entrada.component.css']
})
export class EntradaComponent {

  listEntrada: Entrada[] = []
  

  entradaForm: FormGroup = new FormGroup({});

  entrada: Entrada = {
    fecha: "",
    fk_idParque: "",
    fk_cedula: ""
  }

  constructor(private entradaService: EntradaService, private router: Router) { }

  loadForm() {

    this.entradaForm = new FormGroup({
      fecha: new FormControl(this.entrada.fecha),
      fk_idParque: new FormControl(this.entrada.fk_idParque, [Validators.required]),
      fk_cedula: new FormControl(this.entrada.fk_cedula, [Validators.required])
    });
  }

  ngOnInit(): void {
    this.loadForm();
    this.getEntrada();
  }

  agregar() {

    if (this.entradaForm.value.Id == "") {

      this.entrada = this.setEntradaWithForm();

      this.entradaService.addEntrada(this.entrada).subscribe((res: any) => {
        alert("Hubo respuesta");
        console.log(res);
      });

      this.cleanEntrada();

    } else {

      this.entrada = this.setEntradaWithForm();

      this.entradaService.updateEntrada(this.entrada).subscribe((res: any) => {
        alert("Hubo respuesta");
        console.log(res);
      });

      this.cleanEntrada();
    }
  }

  actualizar(Id: any) {

    this.entrada = this.listEntrada[Id - 1];

    this.loadForm();

  }

  eliminar(Id: any) {

    this.entradaService.eliminarEntrada(Id).subscribe((res: any) => {
      alert("Hubo respuesta");
      console.log(res);
    });

  }

  getEntrada() {
    this.entradaService.getEntrada().subscribe((res: Entrada[]) => {
      this.listEntrada = res;
      console.log(this.listEntrada);

    })
  }

  cleanEntrada() {
    this.entrada = {
      fecha: "",
      fk_idParque: "",
      fk_cedula: ""
    }

    this.loadForm();
  }

  setEntradaWithForm() {
    this.entrada.fecha = this.entradaForm.value.fecha + "";
    this.entrada.fk_idParque = this.entradaForm.value.fk_idParque + "";
    this.entrada.fk_cedula = this.entradaForm.value.fk_cedula + "";



    return this.entrada;

  }
}