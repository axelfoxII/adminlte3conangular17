import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UsuarioModel } from '../../models/usuario.model';
import { ClienteModel } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';
import { RuletaService } from '../../services/ruleta.service';
import { Ruleta } from '../../interfaces/ruleta.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  
  usuarios:UsuarioModel[]=[];
  clientes:ClienteModel[]=[];
  ruletas:Ruleta[]=[];

  totalUsuarios: number = 0; // Variable para contar usuarios
  totalClientes: number = 0; // Variable para contar clientes
  totalRuletas: number = 0;
  constructor(private apiSvc: ApiService, private clientesSvc:ClienteService, private ruletaSvc:RuletaService){



  }
  
  ngOnInit(): void {
    this.apiSvc.getUsuarios().subscribe({
      next: (usuariosData) => {
        this.usuarios= usuariosData;
        this.totalUsuarios = usuariosData.length;
        
      }
    })

    this.clientesSvc.getClientes().subscribe({
      next: (clientesData: ClienteModel[] | null) => {
        if (clientesData !== null) {
          this.clientes = clientesData;    
          this.totalClientes = clientesData.length;      
        }
      }
    })

    this.ruletaSvc.getRuletas().subscribe({
      next:(ruletaData:Ruleta[] | null)=>{
        if (ruletaData !== null) {
          
          this.ruletas = ruletaData
          this.totalRuletas = ruletaData.length;
        }
        
        
      }

    })
  }

}
