import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {


  public menuItems:any[]=[{

    titulo:'Dashboard',
    icono:'nav-icon fas fa-tachometer-alt',
    submenu:[
      {titulo:'DataTable', url:'heroes', icon:'far fa-circle' },
      {titulo:'Toaster', url:'toaster', icon:'far fa-circle' },
    ]


  }];

  logout(){

    location.href='login';

  }



}
