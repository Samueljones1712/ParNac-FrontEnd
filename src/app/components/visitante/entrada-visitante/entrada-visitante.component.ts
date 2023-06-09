import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Entrada } from 'src/app/interface/entrada';
import { EntradaService } from 'src/app/services/entrada.service';
import { ParkService } from 'src/app/services/park.service';
import { parkNational } from 'src/app/interface/parkNational';


@Component({
  selector: 'app-entrada-visitante',
  templateUrl: './entrada-visitante.component.html',
  styleUrls: ['./entrada-visitante.component.css']
})
export class EntradaVisitanteComponent implements OnInit {

  Id: string = "";
  minDate: string;
  loading: boolean = true;


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

  entrada: Entrada = {
    CantExtranjeros: 0,
    CantNacionales: 0,
    cedula: "",
    grupo: "",
    id: 0,
    IdParque: "",
    fechaVencimiento: ""
  }


  constructor(private route: ActivatedRoute, private parkService: ParkService) {

    const today = new Date();
    this.minDate = this.formatDate(today);
    this.getParkNational();

  }

  ngOnInit() {

    this.Id = this.route.snapshot.paramMap.get('Id') ?? '';

    this.getParkNational();

  }

  getParkNational() {

    this.parkService.getParkNational(this.Id).subscribe((res: any) => {

      this.park = res[0];

      this.loading = false;

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

  }

}
