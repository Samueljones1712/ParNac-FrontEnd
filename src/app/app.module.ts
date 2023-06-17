import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//Modulos 
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

//Modelos
import { LoginComponent } from './components/login/login.component';
import { VerifyComponent } from './components/verify/verify.component';
import { IndexComponent } from './components/index/index.component';
import { RegisterComponent } from './components/register/register.component'

//Service
import { LoginConnectionService } from './services/login-connection.service';
import { ParkService } from './services/park.service';
import { ErrorService } from './services/error.service';
import { AlertService } from './utils/alert.service';
import { UserService } from './services/user.service';
import { ControlInternoService } from './services/control-interno.service';

//Interface
import { User } from './interface/user';

//Interceptor
import { AddTokenInterceptor } from './utils/add-token.interceptor';

//Toast
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { EntradaComponent } from './components/entrada/entrada.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';

/* DataTable */
import { DataTablesModule } from "angular-datatables";
import { EntradaVisitanteComponent } from './components/visitante/entrada-visitante/entrada-visitante.component';
import { IndexVisitanteComponent } from './components/visitante/index-visitante/index-visitante.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    VerifyComponent,
    IndexComponent,
    RegisterComponent,
    EntradaComponent,
    NavbarComponent,
    DashboardComponent,
    SpinnerComponent,
    UsuariosComponent,
    EntradaVisitanteComponent,
    IndexVisitanteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    DataTablesModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true }, LoginConnectionService, ParkService, UserService, ControlInternoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
