import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild('containerParks', { static: false }) containerParks!: ElementRef;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  listParks: parkNational[] = [];

  loading: boolean = false;

  parksPerPage: number = 12;
  currentPage: number = 1;
  displayParks: parkNational[] = [];

  //TENGO QUE HACERLE UN BUSCAR POR NOMBRE, ACTIVO EL LOADING Y DE LA LISTA ELIMINO UNOS.
  filteredParks: parkNational[] = [];
  searchTerm: string = '';

  constructor(private parkService: ParkService, private router: Router, private toastr: ToastrService, private http: HttpClient) { }


  ngOnInit(): void {
    this.listParks = [];
    this.filteredParks = this.listParks;
    this.getParquesNacionales();


  }

  getParquesNacionales() {

    this.toastr.info("Cargando los Parques Nacionales", "Cargando...");
    this.loading = true;
    this.parkService.getParkNationals().subscribe((res: parkNational[]) => {

      this.loading = false
      this.listParks = res;
      this.filteredParks = this.listParks;
      this.updateParks();
    })
  }

  reservation(Id: any) {

    this.router.navigate(['/entrada-visitante', Id]);

  }
  updateParks() {
    const startIndex = (this.currentPage - 1) * this.parksPerPage;
    const endIndex = startIndex + this.parksPerPage;
    this.displayParks = this.filteredParks.slice(startIndex, endIndex);
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateParks();
      this.scrollToTop();
    }
  }
  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.updateParks();
      this.scrollToTop();
    }
  }
  totalPages() {
    return Math.ceil(this.listParks.length / this.parksPerPage);
  }
  scrollToTop() {
    if (this.containerParks && this.containerParks.nativeElement) {
      this.containerParks.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  handleSearch() {
    this.filteredParks = this.listParks.filter(park =>
      park.Nombre.toLowerCase().includes(this.searchTerm.toLowerCase()));
    console.log(this.filteredParks);

    this.updateParks();
  }


}
