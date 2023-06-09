import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { ParkService } from 'src/app/services/park.service';
import Swal from 'sweetalert2'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { parkNational } from 'src/app/interface/parkNational';

@Component({
  selector: 'app-index-visitante',
  templateUrl: './index-visitante.component.html',
  styleUrls: ['./index-visitante.component.css']
})
export class IndexVisitanteComponent implements OnInit {


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  listParks: parkNational[] = [];
  loading: boolean = false;

  //TENGO QUE HACERLE UN BUSCAR POR NOMBRE, ACTIVO EL LOADING Y DE LA LISTA ELIMINO UNOS.


  constructor(private parkService: ParkService, private router: Router, private toastr: ToastrService, private http: HttpClient) { }


  ngOnInit(): void {
    this.getParquesNacionales();
  }

  getParquesNacionales() {

    this.toastr.info("Cargando los Parques Nacionales", "Cargando...");
    this.loading = true;
    this.parkService.getParkNationals().subscribe((res: parkNational[]) => {

      this.loading = false
      this.listParks = res;
    })
  }

  reservation(Id: any) {

    this.router.navigate(['/entrada-visitante', Id]);

  }

}
