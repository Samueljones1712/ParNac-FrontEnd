import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {


  loading: boolean = true;
  filterStartDate: string = '';
  filterEndDate: string = '';

  ngOnInit(): void {

  }

  applyDateRangeFilter() {

    if (this.filterStartDate != "" && this.filterEndDate != "") {
      console.log(this.filterStartDate + " - " + this.filterEndDate);

      const fechas = [this.filterStartDate, this.filterEndDate];

      this.entradaService.getEntradaByDate(fechas).subscribe((res: view_entrada[]) => {
        this.listEntradas = res;
      })
    }
  }


}
