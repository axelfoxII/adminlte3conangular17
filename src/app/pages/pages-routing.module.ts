import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ProductosComponent } from './productos/productos.component';
import { HeroesComponent } from './heroes/heroes.component';
import { ToasterComponent } from './toaster/toaster.component';
import { authGuard } from '../guards/auth.guard';
import { ReportesComponent } from './reportes/reportes.component'; // Añade otros componentes independientes aquí
import { IndependienteComponent } from './independiente/independiente.component';
import { ItemindependienteComponent } from './itemindependiente/itemindependiente.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardComponent, data: { titulo: 'Dashboard' } },
      { path: 'usuarios', component: UsuariosComponent, data: { titulo: 'Usuarios' } },
      { path: 'productos', component: ProductosComponent, data: { titulo: 'Productos' } },
      { path: 'heroes', component: HeroesComponent, data: { titulo: 'heroes' } },
      { path: 'toaster', component: ToasterComponent, data: { titulo: 'toaster' } },
    ]
  },
  { path: 'reportes', component: ReportesComponent, canActivate: [authGuard], data: { titulo: 'Reportes' } },
  {
    path: 'independiente',
    component: PagesComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: IndependienteComponent, data: { titulo: 'Independiente' } },
      { path: 'itemindependiente', component: ItemindependienteComponent, data: { titulo: 'Itemindependiente' } },
    ]
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
