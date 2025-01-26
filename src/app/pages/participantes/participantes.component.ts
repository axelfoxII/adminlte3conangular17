import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { ClienteModel } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';
import { UserControls } from '../../interfaces/usuarioControl.interface';

@Component({
  selector: 'app-participantes',
  templateUrl: './participantes.component.html',
  styleUrls: ['./participantes.component.css']
})
export class ParticipantesComponent implements  OnInit, AfterViewInit {

  displayedColumns: string[] = ['celular','whatsapp', 'premio','actions','fecha' ];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('pagination') set pagination(pager: MatPaginator) {
    if (pager) {
      this.dataSource.paginator = pager;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = "Items por pagina";
      this.dataSource.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return `0 de ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        // If the start index exceeds the list length, do not try and fix the end index to the end.
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} de ${length}`;
      };



    }
  }
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  clientes:ClienteModel[] = [];
  cliente:ClienteModel = new ClienteModel();
  nombreUserControl='';
  controlUser={

    usuario: '',
    celular:'',
    premio:'',
    fecha:''

  };

  userContolRuleta = localStorage.getItem('currentUser')

  constructor(private clienteSvc:ClienteService, private router:Router) { 

    const nombreUsuario = localStorage.getItem('currentUser');

    if (nombreUsuario) {
      try {
        const { nombre } = JSON.parse(nombreUsuario); // Desestructurar el objeto
        
        this.nombreUserControl = nombre;
        
      } catch (error) {
        console.error('Error al parsear el JSON:', error);
      }
    }

  }


  ngOnInit() {

    this.clienteSvc.getClientes().subscribe((res:ClienteModel[] | null) => {
          

      if (!res) {
        console.error('La respuesta no puede ser vacío o indefinido');
        return;
      }

     res.forEach((element:ClienteModel) => {
      
      if (element.premio !== '' && element.fecha !== '') {
        this.clientes.push({
          ...element
        })  
      }     
       
     });    
     
     this.dataSource.data= this.clientes;
     
    });
  }

  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
   
  }

  
  applyFilter(filterValue: string) {

    this.dataSource.filter = filterValue.trim().toLowerCase();
  } 


  onUpdate(id:string){

     Swal.fire({
          icon: 'question',
          title: '¿Ya envio la respuesta al cliente de su premio?',
          text: `Si ya la envio aprete el bóton SI`,
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Sí, ya envie"
        }).then((result)=>{

          if (result.isConfirmed) {
            this.clienteSvc.getCliente(id).subscribe((res:ClienteModel)=>{
              const participante ={
                id:id,
                celular:res.celular,
                premio:'',
                estado:false,
                fecha:'',
                trampa:false
              }
        
              this.clienteSvc.updateCliente(participante).subscribe(res=>{
                location.reload();
              })
        
            })
          }

        })

 

  }

  enviarPremio(id: any, celular: number, premio: string) {
    this.controlUser = {
      usuario: this.nombreUserControl || '',
      celular: celular.toString(),
      premio: premio || '',
      fecha: new Date().toISOString() // Genera la fecha actual en formato ISO
    };
  
    console.log('Datos enviados:', this.controlUser);
  
    this.clienteSvc.crearReporteUsers(this.controlUser).subscribe({
      next: () => {
        console.log('Reporte creado exitosamente');
        this.clienteSvc.getCliente(id).subscribe({
          next: (res: any) => {
            this.cliente = res;
  
            if (this.cliente.premio === 'Quizo hacer trampa') {
              window.location.href = `https://wa.me/591${celular}?text=Lo%20sentimos%20hizo%20algo%20indebido...`;
            } else if (this.cliente.premio === 'perdio') {
              window.location.href = `https://wa.me/591${celular}?text=Lo%20sentimos%20no%20gano%20nada%20suerte%20para%20la%20proxima!!`;
            } else {
              window.location.href = `https://wa.me/591${celular}?text=Tu%20premio%20que%20sacaste%20hoy%20es%20${premio}`;
            }
          }
        });
      },
      error: (err) => {
        console.error('Error al crear el reporte:', err);
      }
    });
  }

  btnVolver(){

    this.router.navigateByUrl('dashboard/clientes');

  }

}
