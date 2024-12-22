import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription, filter, map } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.css'
})
export class BreadcrumbsComponent implements OnDestroy {
  
  // Variable para almacenar el título de la página
  public titulo!: string;
  
  // Suscripción para controlar la actualización del título
  public tituloSubs$: Subscription;

  // Constructor del componente, inyecta el servicio Router
  constructor(private router: Router) {
    // Suscripción a los eventos de navegación para obtener el título de la página
    this.tituloSubs$ = this.getArgumentos().subscribe(({ titulo }) => {
      // Actualiza el título de la página y del documento
      this.titulo = titulo;
      document.title = `AdminLte - ${titulo}`;
    });
  }

  // Método ngOnDestroy para limpiar la suscripción cuando el componente se destruye
  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
  }

  // Método para obtener los argumentos de la ruta activa como un observable 
  getArgumentos() {
    return this.router.events.pipe(
      // Filtra solo los eventos de ActivationEnd
      filter((event: any) => event instanceof ActivationEnd),
      // Filtra solo los eventos que representan la primera ruta hija (la ruta principal)
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      // Mapea el evento de ActivationEnd al objeto de datos asociado con la ruta activa
      map((event: ActivationEnd) => event.snapshot.data)
    );
  }
}
/* Los eventos ActivationEnd son eventos específicos del enrutador en Angular. Estos eventos se desencadenan cuando se ha completado la activación de una ruta durante la navegación en la aplicación. */