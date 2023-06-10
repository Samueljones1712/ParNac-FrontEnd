import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyComponent } from './components/verify/verify.component';
import { LoginComponent } from './components/login/login.component';
import { IndexComponent } from './components/index/index.component';
import { RegisterComponent } from './components/register/register.component';
import { EntradaComponent } from './components/entrada/entrada.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { EntradaVisitanteComponent } from './components/visitante/entrada-visitante/entrada-visitante.component';
import { IndexVisitanteComponent } from './components/visitante/index-visitante/index-visitante.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'verify', component: VerifyComponent },
  { path: 'index', component: IndexComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'entrada', component: EntradaComponent },
  { path: 'entrada-visitante/:Id', component: EntradaVisitanteComponent },
  { path: 'index-visitante', component: IndexVisitanteComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
