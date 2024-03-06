import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  nombreUsuario= localStorage.getItem('nombre');

  public menuItems:any[]=[{

    titulo:'Dashboard',
    icono:'nav-icon fas fa-tachometer-alt',
    submenu:[
      {titulo:'DataTable', url:'heroes', icon:'far fa-circle' },
      {titulo:'Toaster', url:'toaster', icon:'far fa-circle' },
    ]


  }];

  logout(){

    localStorage.removeItem('usuario');
    localStorage.removeItem('nombre');

    location.href='login';

  }



}
