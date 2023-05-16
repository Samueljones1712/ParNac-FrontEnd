import { Component, OnInit } from '@angular/core';
import { ParkService } from 'src/app/services/park.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor(private parkService: ParkService, private router: Router) { }

  ngOnInit(): void {
    this.getParquesNacionales();
  }

  getParquesNacionales() {
    this.parkService.getParkNationals().subscribe((res: any) => {

      console.log(res);

    })
  }



}
