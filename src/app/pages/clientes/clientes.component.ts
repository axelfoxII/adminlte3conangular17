import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ClienteModel } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';

declare var $: any;

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['celular', 'whatsapp', 'estado', 'actions'];
  
  // Asegúrate de que dataSource esté correctamente tipado como MatTableDataSource<ClienteModel>
  dataSource: MatTableDataSource<ClienteModel> = new MatTableDataSource<ClienteModel>();
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('pagination') set pagination(pager: MatPaginator) {
    if (pager) {
      this.dataSource.paginator = pager;
      this.dataSource.paginator._intl = new MatPaginatorIntl();
      this.dataSource.paginator._intl.itemsPerPageLabel = "Items por pagina";
      this.dataSource.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return `0 à ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} de ${length}`;
      };
    }
  }

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  btnEstado!: boolean;
  clienteForm!: FormGroup;
  isFormInvalid: boolean = false;
  clientes: ClienteModel[] = [];
  cliente: ClienteModel = new ClienteModel();

  constructor(private clienteSvc: ClienteService, private router: Router, private fb: FormBuilder) {}

  ngOnInit() {
    // Obtener los clientes al iniciar
    this.clienteSvc.getClientes().subscribe({
      next: (users: ClienteModel[] | null) => {
        if (users !== null) {
          this.dataSource.data = users; // Asignar los clientes al dataSource
        } else {
          console.error('No se encontraron clientes');
          this.dataSource.data = []; // En caso de null, puedes asignar un arreglo vacío
        }
      },
      error: (err) => {
        console.error('Error al obtener los clientes:', err);
      }
    });
  
    this.clienteForm = this.fb.group({
      celular: [
        '',
        [
          Validators.required,
          Validators.pattern('^[67][0-9]{7}$'),  // Patrón para validar números
          Validators.minLength(8),               // Asegurar que tenga al menos 8 caracteres
          Validators.maxLength(8),               // Asegurar que no tenga más de 8 caracteres
        ],
      ],
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Suscribirse a los cambios de estado del formulario
    this.clienteForm.statusChanges.subscribe((status) => {
      this.isFormInvalid = status === 'INVALID';
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  cambiarEstado(id: string, estado: boolean) {
    let idCliente = id;
    this.btnEstado = estado;
    this.clienteSvc.getCliente(idCliente).subscribe((cliente: ClienteModel) => {
      const clienteEstado: ClienteModel = {
        id: id,
        celular: cliente.celular,
        premio: '',
        fecha: '',
        estado: this.btnEstado,
        trampa: false
      };

      this.clienteSvc.updateCliente(clienteEstado).subscribe(res => {
        console.log(res);
      });
    });
  }

  enviarJuego(id: any, celular: number) {
    this.clienteSvc.getCliente(id).subscribe({
      next: (cliente: ClienteModel) => {
        if (cliente.estado === true) {
          window.location.href = `https://wa.me/591${celular}?text=Esto%20es%20por%20tu%20fidelidad%20te%20enviamos%20esta%20cortesia%20para%20elegir%20juega%20y%20gana%20haz%20click%20en%20el%20enlace-->%20https://ruletajuego.netlify.app/`;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Desbloquee el estado antes de enviar!!',
            html: '<button class="btn btn-danger btn-large" ><i class="fa fa-lock" aria-hidden="true"></i></button>  <b>=></b> <button class="btn btn-success btn-large" ><i class="fa fa-unlock" aria-hidden="true"></i></button>',
          });
        }
      }
    });
  }

  onRegister() {
    const clienteAdd: ClienteModel = {
      celular: this.clienteForm.value.celular ?? '',
      estado: false,
      premio: '',
      fecha: '',
      trampa: false
    };

    if (!clienteAdd.celular) {
      console.error('El celular no puede ser vacío o indefinido');
      return;
    }

    this.clienteSvc.verificarCelular(clienteAdd.celular).subscribe({
      next: (res) => {
        if (res) {
          Swal.fire({
            icon: 'error',
            title: `El número ${clienteAdd.celular} ya existe en la base de datos..`,
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false
          }).then((result) => {
            if (result) {
              this.clienteForm.reset();
            }
          });
        } else {
          this.clienteSvc.crearCliente(clienteAdd).subscribe(res => {
            this.dataSource.data = [...this.dataSource.data, res];
            $('#agregarCliente').modal('hide');
          });

          Swal.fire({
            icon: 'success',
            title: 'El cliente se guardó correctamente',
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false
          });
        }
      }
    });
  }

  onDeleteCliente(id: string): void {
    Swal.fire({
      icon: 'question',
      title: '¿Desea eliminar al cliente?',
      text: `Esta operación no puede deshacerse...`,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar"
    }).then((res) => {
      if (res.value) {
        // Llamamos al servicio para eliminar al cliente de la base de datos
        this.clienteSvc.deleteCliente(id).subscribe({
          next: () => {
            const clientesData: ClienteModel[] = this.dataSource.data;
            const index = clientesData.findIndex((cliente: ClienteModel) => cliente.id === id);

            if (index !== -1) {
              clientesData.splice(index, 1); // Eliminar 1 cliente en el índice encontrado
              this.dataSource = new MatTableDataSource<ClienteModel>([...clientesData]); // Actualizar la vista con la nueva lista de clientes
            }
         
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar el cliente',
              text: err.message,
              confirmButtonText: 'Aceptar',
            });
          }
        });
      }
    });
  }

  btnCortesias() {
    this.router.navigateByUrl('dashboard/participantes');
  }

  limpiarForm(){
    this.clienteForm.reset();
  }

}
