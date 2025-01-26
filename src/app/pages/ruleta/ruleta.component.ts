import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { RuletaService } from '../../services/ruleta.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Ruleta } from '../../interfaces/ruleta.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-ruleta',
  templateUrl: './ruleta.component.html',
  styleUrls: ['./ruleta.component.css'],
})
export class RuletaComponent implements OnInit, AfterViewInit {
  // Variables de configuración
  nombreCampana: string = ''; // Nombre de la campaña
  cantidadPremios: string | null = null; // Sin valor inicial
  cantidadTiros: number = 0; // Cantidad de tiros seleccionada
  premios: any[] = []; // Lista de premios generada
  imagenURL: string = '';
  imagenRuleta:string = '';
  // Opciones para los dropdowns
  cantidadPremiosOptions: number[] = [3, 4, 5, 6, 7, 8,9,10];
  cantidadTirosOptions: number[] = [1, 2, 3];

   ruletas: Ruleta[] = [];
   ruleta!:Ruleta;
   dataSource!: MatTableDataSource<Ruleta>;
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private ruletaSvc: RuletaService) {}
  
  ngOnInit(){

    this.ruletaSvc.getRuletas().subscribe({
      next: (ruletaData: any) => {
        this.ruletas = ruletaData;
        this.dataSource = new MatTableDataSource(this.ruletas);
        console.log(this.ruletas);

         // Si dataSource está definido, asigna el paginador
      if (this.dataSource) {
        this.dataSource.paginator = this.paginator;
      }

      }
    });
    
  }
  
  
  ngAfterViewInit() {

     // Si dataSource ya está definido, asigna el paginador
     if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
    
  }

  displayedColumns: string[] = ['imagen', 'nombre', 'estado', 'actions'];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  // Generar los premios basados en la cantidad seleccionada
  generarPremios() {
    // Validar que cantidadPremios no sea nulo y convertirlo a número
    const cantidadNumerica = Number(this.cantidadPremios);
    if (isNaN(cantidadNumerica) || cantidadNumerica < 3 || cantidadNumerica > 10) {
      alert('La cantidad de premios debe estar entre 3 y 8.');
      return;
    }

    this.premios = []; // Reiniciar premios
    const division = 360 / cantidadNumerica;

    for (let i = 0; i < cantidadNumerica; i++) {
      this.premios.push({
        rango_inicio: i * division,
        rango_fin: (i + 1) * division,
        premio: '', // Inicialmente vacío, el usuario lo llena
      });
    }
  }

  // Guardar los datos de la ruleta en Firebase
  guardarRuleta(ruletaForm: NgForm) {
    if (!this.nombreCampana) {
      alert('Por favor, ingrese el nombre de la campaña.');
      return;
    }

    // Crear la ruleta con los datos ingresados
    const ruleta = {
      nombre: this.nombreCampana,
      estado: false,
      cantidadPremios:ruletaForm.value.cantidadPremios,
      imagenURL: ruletaForm.value.imagenURL,
      premios: this.premios.reduce((acc, premio, index) => {
        acc[`rango${index + 1}`] = {
          rango_inicio: premio.rango_inicio,
          rango_fin: premio.rango_fin,
          premio: premio.premio,
        };
        return acc;
      }, {}),
      tiros: this.cantidadTiros,
    };

    // Llamar al servicio para guardar la ruleta
    this.ruletaSvc.crearRuleta(ruleta).subscribe({
      next: (response: any) => {
        Swal.fire({
          icon:'success',
          title: 'EXITO',
          text:'La ruleta ha sido guardada correctamente.',
          confirmButtonText:'Aceptar',
          cancelButtonText:'#green'
        }).then((result)=>{

          if (result) {

            location.reload();            
          }

        })
      },
      error: (error: any) => {
        console.error('Error al guardar la ruleta:', error);
        Swal.fire({
          icon: 'error',
          title: 'ERROR',
          text: 'Ha ocurrido un error al guardar la ruleta.',
        })
      },
    });
  }

  limpiarForm(forma:NgForm){
      forma.reset();
  }

onDeleteRuleta(id: string): void {

  this.ruletaSvc.getRuleta(id).subscribe({
    next: (ruleta) => {
      this.ruleta = ruleta
      if (this.ruleta.estado === true) {
        
        Swal.fire({
          icon:'info',
          title: 'La ruleta esta en uso de la campaña',
          text: 'Debe seleccionar otra ruleta antes de borrarla..',
        });
        return; 


      }else{
        Swal.fire({
          icon: 'question',
          title: '¿Desea eliminar Ruleta?',
          text: `Esta operación no puede deshacerse...`,
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Sí, eliminar"
        }).then((res) => {
          if (res.value) {
            // Llamamos al servicio para eliminar al cliente de la base de datos
            this.ruletaSvc.borrarRuleta(id).subscribe({
              next: () => {
                const ruletaData: Ruleta[] = this.dataSource.data;
                const index = ruletaData.findIndex((ruleta: Ruleta) =>ruleta.id === id);
    
                if (index !== -1) {
                  ruletaData.splice(index, 1); // Eliminar 1 ruleta en el índice encontrado
                  this.dataSource = new MatTableDataSource<Ruleta>([...ruletaData]); // Actualizar la vista con la nueva lista de clientes
                }
             
              },
              error: (err) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error al eliminar la ruleta',
                  text: err.message,
                  confirmButtonText: 'Aceptar',
                });
              }
            });
          }
        });

      }

    }
  })
 }

    seleccionarEstado(ruletaSeleccionada: Ruleta) {
      // Establecemos todos los estados de las ruletas en false primero
      this.ruletas.forEach((ruleta) => {
        ruleta.estado = false;
      });
    
      // Si esta es la primera ruleta (sin ningún valor en 'estado' = true), entonces le asignamos 'true' a la seleccionada
      if (this.ruletas.length === 0 || !this.ruletas.some(ruleta => ruleta.estado === true)) {
        ruletaSeleccionada.estado = true;  // Solo si no hay ninguna ruleta con estado 'true'
      }
    
      // Luego establecemos el estado de la ruleta seleccionada en true
      ruletaSeleccionada.estado = true;
    
      // Actualizamos todos los cambios en Firebase
      this.actualizarEstadoRuletasEnFirebase();
    }
    
    actualizarEstadoRuletasEnFirebase() {
      // Para asegurar que solo haya un 'true', actualizamos todas las ruletas en la base de datos
      const updateRequests = this.ruletas.map(ruleta => {
        return this.ruletaSvc.actualizarEstadoRuleta(ruleta);
      });
    
      // Ejecutamos todas las actualizaciones en paralelo
      forkJoin(updateRequests).subscribe({
        next: () => {
          console.log('Estado actualizado correctamente');
          // Aquí puedes manejar el refresco de la tabla o lo que sea necesario
        },
        error: (error) => {
          console.error('Error al actualizar el estado:', error);
        },
      });
    }  
    
    verImagen(id:any){

      this.ruletaSvc.getRuleta(id).subscribe({
        next: (ruleta) => {
          this.imagenRuleta = ruleta.imagenURL;
          
        } 
        });

    }
    
    
}
