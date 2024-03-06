import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroesComponent } from './heroes/heroes.component';
import { ToasterComponent } from './toaster/toaster.component';
import { authGuard } from '../guards/auth.guard';

const routes: Routes = [

  {path:'dashboard', component:PagesComponent, canActivate:[authGuard],

  children:[

    {path:'', component:DashboardComponent, data:{titulo:'Dashboard'}},
    {path:'heroes', component:HeroesComponent, data:{titulo:'DataTable'}},
    {path:'toaster', component:ToasterComponent, data:{titulo:'Toaster'}},


  ]
 }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
