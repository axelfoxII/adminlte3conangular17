import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import{MatTableModule} from '@angular/material/table';
import{MatFormFieldModule} from '@angular/material/form-field';
import{MatButtonModule} from '@angular/material/button';
import{MatInputModule} from '@angular/material/input';
import{MatPaginatorModule} from '@angular/material/paginator';




import { PagesRoutingModule } from './pages-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroesComponent } from './heroes/heroes.component';
import { ToasterComponent } from './toaster/toaster.component';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    DashboardComponent,
    HeroesComponent,
    ToasterComponent,
    PagesComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    MatTableModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule
  ]
})
export class PagesModule { }
