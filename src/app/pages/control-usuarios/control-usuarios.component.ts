import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UserControls } from '../../interfaces/usuarioControl.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ClienteService } from '../../services/cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-control-usuarios',
  templateUrl: './control-usuarios.component.html',
  styleUrl: './control-usuarios.component.css'
})
export class ControlUsuariosComponent implements OnInit, AfterViewInit {

    userControls: UserControls[] = [];
    dataSource!: MatTableDataSource<UserControls>;
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
  
    constructor(private clienteSvc: ClienteService) { }
  
    ngOnInit() {
      // Obtener los datos de héroes y configurar las columnas
      this.clienteSvc.getReporteUsers().subscribe((usersData:any) => {
        if (!usersData || usersData.length === 0) {
         
          return;
        }
        this.userControls = usersData;
        this.dataSource = new MatTableDataSource(this.userControls);
        console.log(this.userControls);
  
        // Si dataSource está definido, asigna el paginador
        if (this.dataSource) {
          this.dataSource.paginator = this.paginator;
        }
      });
    }
  
    ngAfterViewInit() {
      // Si dataSource ya está definido, asigna el paginador
      if (this.dataSource && this.dataSource.paginator) {
        this.dataSource.paginator = this.paginator;
        
      }
    }
  
    displayedColumns: string[] = ['usuario', 'celular', 'premio', 'fecha'];
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      if (this.dataSource.data && this.dataSource.data.length > 0) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
      }
    }

    borrarRegistros() {

      Swal.fire({
        icon: 'question',
        title: '¿Desea eliminar los registros?',
        text: `Esta operación no puede deshacerse...`,
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar"
      }).then((result)=>{
        if(result.isConfirmed) {
          this.clienteSvc.borrarTodosLosRegistros().subscribe({
           next: () => {
                       // Notificación de éxito
                       Swal.fire({
                         icon: 'success',
                         title: 'Eliminado',
                         text: 'Registros eliminados correctamente.',
                       }).then((result)=>{
                         if(result){
                           location.reload();  
                         }
                       })
                     },
                     error: (err) => {
                       // Si ocurre un error en la eliminación, restaurar el usuario en la lista
                       Swal.fire({
                         icon: 'error',
                         title: 'Error',
                         text: 'Ocurrió un error al eliminar los registros.',
                       });
                       console.error('Error al eliminar registros:', err);
                                        
                     }
          });
        }
      })

  
    }
}
