import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  nombreUsuario = localStorage.getItem('nombre');

  public menuItems: any[] = [
    {
      titulo: 'Dashboard',
      icono: 'nav-icon fas fa-tachometer-alt',
      submenu: [
        { titulo: 'Usuarios',  icon: 'fa fa-users', routerLink: '/dashboard/usuarios' },
        { titulo: 'Productos', icon: 'fas fa-box', routerLink: '/dashboard/productos' },
        { titulo: 'Datatable', icon: 'far fa-circle', routerLink: '/dashboard/heroes' },
        { titulo: 'Toaster',   icon: 'far fa-circle', routerLink: '/dashboard/toaster' }
      ]
    },
     {
      titulo: 'Independiente',
      icono: 'nav-icon fas fa-address-book',
      submenu: [
        { titulo: 'Itemindependiente',  icon: 'fas fa-wind', routerLink: '/independiente/itemindependiente' },
        
      ]
    },
    {
      titulo: 'Reportes',
      icono: 'nav-icon fas fa-chart-pie',
      routerLink: '/reportes' // Menú independiente
    }, 
    
  ];
  
  
  logout() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('nombre');
    location.href = 'login';
  }

}
