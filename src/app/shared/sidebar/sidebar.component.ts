import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public estado: number | undefined; // Estado del usuario
  public nombre: string | undefined; // Nombre del usuario
  public rol: boolean = false; // Inicializar el rol por defecto
  public menuItems: any[] = []; // Menú principal

  constructor() {
    const nombreUsuario = localStorage.getItem('currentUser');

    if (nombreUsuario) {
      try {
        const { estado, nombre, rol } = JSON.parse(nombreUsuario); // Desestructurar el objeto
        this.estado = estado;
        this.nombre = nombre;
        this.rol = !!rol; // Asegurar que sea un booleano
      } catch (error) {
        console.error('Error al parsear el JSON:', error);
      }
    }
  }

  ngOnInit() {
    // Configurar el menú según el rol
  this.menuItems = [
    {
      titulo: 'Dashboard',
      icono: 'nav-icon fas fa-tachometer-alt',
      submenu: [
        ...(this.rol ? [{ titulo: 'Usuarios', icon: 'fa fa-users', routerLink: '/dashboard/usuarios' }] : []),
        { titulo: 'Clientes', icon: 'fa fa-address-book', routerLink: '/dashboard/clientes' },
        { titulo: 'Ruleta', icon: 'fas fa-circle-notch', routerLink: '/dashboard/ruleta' },
        ...(this.rol ? [{ titulo: 'Control', icon: 'fa fa-address-card', routerLink: '/dashboard/control-users' }] : [])
      ]
    }
  ];
  }

  logout() {
    localStorage.removeItem('currentUser');
    location.href = 'login'; // Redirige al login
  }
}
