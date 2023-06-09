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

@Component({
  selector: 'app-entrada-visitante',
  templateUrl: './entrada-visitante.component.html',
  styleUrls: ['./entrada-visitante.component.css']
})
export class EntradaVisitanteComponent implements OnInit {

  Id: string = "";
  minDate: string;
  loading: boolean = true;

  entrada: Entrada = {
    CantExtranjeros: 0,
    CantNacionales: 0,
    cedula: "",
    fechaVencimiento: "",
    grupo: "",
    id: 0,
    IdParque: ""
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
    CantExtranjeros: new FormControl(0, [Validators.min(0), Validators.max(100)]),
    CantNacionales: new FormControl(0, [Validators.min(0), Validators.max(100)]),
    grupo: new FormControl("", [Validators.required]),
    fechaVencimiento: new FormControl("", [Validators.required]),
  });


  constructor(private route: ActivatedRoute, private parkService: ParkService, private userService: UserService, private entradaService: EntradaService) {

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


    this.entrada.CantExtranjeros = this.entradaForm.value.CantExtranjeros;
    this.entrada.CantNacionales = this.entradaForm.value.CantNacionales;
    this.entrada.grupo = this.entradaForm.value.grupo;
    this.entrada.fechaVencimiento = this.entradaForm.value.fechaVencimiento + "";
    this.entrada.IdParque = this.park.Id + "";
    this.entrada.cedula = this.usuario.identificacion;
    
    console.log(this.entrada);

    this.saveEntrada();


  }

  saveEntrada(): Promise<void> {

    return new Promise<void>((resolve, reject) => {

      this.entradaService.addEntrada(this.entrada).subscribe((res: any) => {
        console.log(res);
        resolve();
      }, (error) => {
        reject(error);
      });
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

    //SweetAlert y preguntar si esta seguro que no se puede editar, 
    //debo validar que minimo lleve uno de alguno de los dos y debo calcular el subtotal y el iva(13%)



    alert("agrego");

    this.getEntrada();

  }

}
