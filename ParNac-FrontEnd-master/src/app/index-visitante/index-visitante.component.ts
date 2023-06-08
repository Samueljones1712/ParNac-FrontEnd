import { Component, OnInit } from '@angular/core';
import { ParkService } from 'src/app/services/park.service';
import { Router } from '@angular/router';
import { parkNational } from 'src/app/interface/parkNational';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-index-visitante',
  templateUrl: './index-visitante.component.html',
  styleUrls: ['./index-visitante.component.css']
})
export class IndexVisitanteComponent {

  loading: boolean = false;

  listParques: parkNational[] = [];

  constructor(private parkService: ParkService, private router: Router, private toastr: ToastrService, private http: HttpClient) { }


  ngOnInit(): void {

    this.getParquesNacionales();

  }


  getParquesNacionales() {

    this.toastr.info("Cargando los Parques Nacionales", "Cargando...");
    this.loading = true;
    this.parkService.getParkNationals().subscribe((res: parkNational[]) => {

      this.loading = false
      this.listParques = res;
    })
  }

}
