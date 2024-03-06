import { Component, ElementRef, Renderer2 } from '@angular/core';

declare var $:any;

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.css'
})
export class ToasterComponent {

  constructor(private renderer:Renderer2, private el:ElementRef){}

  ngAfterViewInit(){

    const toastButtons = this.el.nativeElement.querySelectorAll('.toast-button');
    
    toastButtons.forEach((button: { getAttribute: (arg0: string) => any; }) => {
      this.renderer.listen(button, 'click', () => {
        const toastTitle = button.getAttribute('data-title');
        const toastSubtitle = button.getAttribute('data-subtitle');
        const toastBody = button.getAttribute('data-body');
        const toastClass = button.getAttribute('data-class');
        

        $(document).Toasts('create', {
          class: toastClass,
          title: toastTitle,
          subtitle: toastSubtitle,
          body: toastBody,
          autohide: true, // Para que el toast se oculte automáticamente
          delay: 2000, // Duración en milisegundos antes de que el toast se oculte automáticamente (2 segundos en este caso)
        });
      });
    });
  }

  }


