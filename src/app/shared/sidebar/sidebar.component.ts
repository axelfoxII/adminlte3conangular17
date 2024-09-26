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
        { titulo: 'DataTable', url: 'heroes', icon: 'far fa-circle' },
        { titulo: 'Toaster', url: 'toaster', icon: 'far fa-circle' },
        {
          titulo: 'Advanced',
          icon: 'far fa-circle',
          submenu: [ // Submenú dentro de otro submenú
            { titulo: 'Settings', url: 'advanced/settings', icon: 'far fa-dot-circle' },
            { titulo: 'Logs', url: 'advanced/logs', icon: 'far fa-dot-circle' },
          ]
        },
      ]
    },
    {
      titulo: 'Settings', // Menú adicional
      icono: 'nav-icon fas fa-cogs',
      submenu: [
        { titulo: 'Profile', url: 'profile', icon: 'far fa-user' },
        { titulo: 'Privacy', url: 'privacy', icon: 'fa fa-lock' },
      ]
    }
  ];

  logout() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('nombre');
    location.href = 'login';
  }
}
