import { Component, OnInit } from '@angular/core';
import { ParkService } from 'src/app/services/park.service';
import { Router } from '@angular/router';
import { parkNational } from 'src/app/interface/parkNational';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2'
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';

import { FormControl, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  dtOptions: DataTables.Settings = {}

  dtTrigger: Subject<any> = new Subject<any>();

  loading: boolean = false;
  resultado: boolean = false;

  selectedFile: File | null = null;
  listParques: parkNational[] = []

  parkForm: FormGroup = new FormGroup({});

  parque: parkNational = {
    Id: 0, Nombre: "",
    Provincia: "",
    Tarifa_Extranjeros_dolares: 0,
    Tarifa_Nacionales_colones: 0,
    Area_de_Conservacion: "",
    imagen: "",
    maxVisitantes: 0,
    horario: ""
  }

  constructor(private parkService: ParkService, private router: Router, private toastr: ToastrService, private http: HttpClient) { }

  loadForm() {

    this.parkForm = new FormGroup({
      Id: new FormControl(this.parque.Id),
      Nombre: new FormControl(this.parque.Nombre, [Validators.maxLength(50)]),
      Provincia: new FormControl(this.parque.Provincia, [Validators.required]),
      Tarifa_Extranjeros_dolares: new FormControl(this.parque.Tarifa_Extranjeros_dolares, [Validators.min(0), Validators.max(100)]),
      Tarifa_Nacionales_colones: new FormControl(this.parque.Tarifa_Nacionales_colones, [Validators.min(0), Validators.max(60000)]),
      Area_de_Conservacion: new FormControl(this.parque.Area_de_Conservacion, [Validators.maxLength(50), Validators.required]),
      maxVisitantes: new FormControl(this.parque.maxVisitantes, [Validators.min(0), Validators.max(2000)]),
      horario: new FormControl(this.parque.horario, [Validators.minLength(0), Validators.maxLength(100)])

    });
  }

  ngOnInit(): void {

    this.loadForm();
    this.getParquesNacionales();

    this.dtOptions = {
      pagingType: 'full_numbers',
      searching: true,
      lengthChange: true,
      language: {
        searchPlaceholder: 'Por nombres de parques',
        url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'
      }
    }
    

  }
  displayStyle="none";
  openPopup(){
    this.displayStyle="block";
  }
  closePopup(){
    this.displayStyle="none";
  }
  /*
  
  this.parque.Nombre = this.parkForm.value.Nombre + "";
    this.parque.Provincia = this.parkForm.value.Provincia + "";
    this.parque.Tarifa_Extranjeros_dolares = this.parkForm.value.Tarifa_Extranjeros_dolares + "";
    this.parque.Tarifa_Nacionales_colones = this.parkForm.value.Tarifa_Nacionales_colones + "";
    this.parque.Area_de_Conservacion = this.parkForm.value.Area_de_Conservacion + "";
  
  */

  validateForm() {

    if (this.parkForm.value.Nombre) {

    }



  }

  agregar() {

    console.log(this.parkForm.value.Id);

    if (this.parkForm.value.Id == "") {

      this.parque = this.setParqueWithForm();

      this.toastr.info("Guardando el Parque Nacional", "Cargando...");

      this.parkService.addParkNational(this.parque).subscribe((res: any) => {

        console.log(res);

        if (res.response.status == "ok") {

          this.toastr.success('Se guardó con éxito el Parque Nacional', 'Correcto');
          this.cleanParque();
          this.setParqueWithForm();
          this.ngOnInit();

        } else {
          this.toastr.error(res.response, 'No se guardó el Parque Nacional');
        }
      });

    } else {

      this.parque = this.setParqueWithForm();

      this.loading = true;

      this.parkService.updateParkNational(this.parque).subscribe((res: any) => {

        if (res.response.status == "ok") {

          this.toastr.success('Se editó con exito el Parque Nacional', 'Correcto');

          this.cleanParque();
          this.setParqueWithForm();
          this.ngOnInit();

        } else {
          this.toastr.error(res.response, 'No se editó el Parque Nacional');
        }
      });

      this.ngOnInit();
    }
  }

  actualizar(Id: any) {

    Swal.fire({
      icon: 'warning',
      title: '¿Desea editar este Parque Nacional?',
      showDenyButton: true,
      confirmButtonText: 'Quiero editarlo',
      denyButtonText: 'No quiero editarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.getUserById(Id);
        //    this.toastr.info("Se esta cargando el Parque Nacional", "Cargando el Parque Nacional...");
        this.toastr.info("Se cargó el Parque Nacional", "Correcto");
        this.ngOnInit();
        this.openPopup();
      } else if (result.isDenied) {
        this.toastr.info("Se ha cancelado la acción");
      }
    })

  }

  eliminar(Id: any) {

    Swal.fire({
      icon: 'warning',
      title: '¿Desea eliminar este Parque Nacional?',
      showDenyButton: true,
      confirmButtonText: 'Quiero eliminarlo',
      denyButtonText: 'No quiero eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.toastr.info("Eliminando el Parque Nacional", "Eliminando...");
        this.parkService.eliminarParkNational(Id).subscribe((res: any) => {
          this.toastr.success('Se eliminó el Parque Nacional', 'Correcto');
          this.ngOnInit();
        });
      } else if (result.isDenied) {
        this.toastr.info("Se ha cancelado la acción");
      }
    })


  }

  getParquesNacionales() {

    this.toastr.info("Cargando los Parques Nacionales", "Cargando...");
    this.loading = true;
    this.parkService.getParkNationals().subscribe((res: parkNational[]) => {

      this.loading = false
      this.listParques = res;
    })
  }

  getUserById(Id: any) {

    for (var i = 0; i < this.listParques.length; i++) {
      if (this.listParques[i].Id == Id) {
        this.parque = this.listParques[i];
      }
    }
  }

  cleanParque() {
    this.parque = {
      Id: 0, Nombre: "",
      Provincia: "",
      Tarifa_Extranjeros_dolares: 0,
      Tarifa_Nacionales_colones: 0,
      Area_de_Conservacion: "",
      imagen: "", maxVisitantes: 0,
      horario: ""
    }

    this.loadForm();
    this.getParquesNacionales();
  }

  setParqueWithForm() {

    this.parque.Nombre = this.parkForm.value.Nombre + "";
    this.parque.Provincia = this.parkForm.value.Provincia + "";
    this.parque.Tarifa_Extranjeros_dolares = this.parkForm.value.Tarifa_Extranjeros_dolares;
    this.parque.Tarifa_Nacionales_colones = this.parkForm.value.Tarifa_Nacionales_colones;
    this.parque.Area_de_Conservacion = this.parkForm.value.Area_de_Conservacion + "";
    this.parque.maxVisitantes = this.parkForm.value.maxVisitantes;
    this.parque.horario = this.parkForm.value.horario + "";
    return this.parque;
  }


  redirectEntrada() {
    this.router.navigate(['entrada'])
  }

  redirectUsuarios() {
    this.router.navigate(['usuarios'])
  }

  reloadCurrentRoute() {
    this.router.navigate(['index'])
  }

  addImage(Id: any) {

  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  uploadImage() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.parkService.sendImg(formData).subscribe(
        (response: any) => {
          this.toastr.success("Se subio la imagen correctamente.", "Correcto");
          // Realiza la lógica adicional con la URL de la imagen copiada en el servidor
        },
        (error) => {
          console.error('Error uploading file:', error);
          this.toastr.error("Error al enviar la imagen.", "Error");
        }
      );
    }
  }
}
