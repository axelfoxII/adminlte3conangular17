import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatIconModule} from '@angular/material/icon';
import { PagesRoutingModule } from './pages-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ProductosComponent } from './productos/productos.component';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { HeroesComponent } from './heroes/heroes.component';
import { ToasterComponent } from './toaster/toaster.component';
import { ReportesComponent } from './reportes/reportes.component';
import { IndependienteComponent } from './independiente/independiente.component';
import { ItemindependienteComponent } from './itemindependiente/itemindependiente.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { ClientesComponent } from './clientes/clientes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RuletaComponent } from './ruleta/ruleta.component';
import { ParticipantesComponent } from './participantes/participantes.component';
import { AyudaRuletaComponent } from './ayuda-ruleta/ayuda-ruleta.component';
import { ControlUsuariosComponent } from './control-usuarios/control-usuarios.component';

@NgModule({
  declarations: [
    DashboardComponent,
    UsuariosComponent,
    ProductosComponent,
    PagesComponent,
    HeroesComponent,
    ToasterComponent,
    ReportesComponent,
    IndependienteComponent,
    ItemindependienteComponent,
    UsuarioComponent,
    ClientesComponent,
    RuletaComponent,
    ParticipantesComponent,
    AyudaRuletaComponent,
    ControlUsuariosComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    MatTableModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PagesModule { }
