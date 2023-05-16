import { Component, OnInit } from '@angular/core';
import { ParkService } from 'src/app/services/park.service';
import { Router } from '@angular/router';
import { parkNational } from 'src/app/interface/parkNational';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  listParques: parkNational[] = []

  constructor(private parkService: ParkService, private router: Router) { }

  ngOnInit(): void {
    this.getParquesNacionales();
  }

  getParquesNacionales() {
    this.parkService.getParkNationals().subscribe((res: parkNational[]) => {
      this.listParques = res;
      console.log(this.listParques);

    })
  }



}
