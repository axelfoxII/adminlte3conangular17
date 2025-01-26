import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {  forkJoin, map, Observable, switchMap } from 'rxjs';
import { ClienteModel } from '../models/cliente.model';
import { UserControls } from '../interfaces/usuarioControl.interface';

const URL= environment.urlServer ;

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  constructor(private http:HttpClient) { }
  
  crearCliente(cliente:ClienteModel){

    return this.http.post(`${URL}/clientes.json`, cliente ).pipe(
      map((res:any)=>{
        cliente.id = res.name;
        return cliente;
      })
    )
  
  }

  crearReporteUsers(controlUser:UserControls){

    return this.http.post(`${URL}/control.json`, controlUser ).pipe(
      map((res:any)=>{
        controlUser.id = res.name;
        return controlUser;
      })
    )
  
  }
  
  getCliente(id:any){
   
    return this.http.get(`${URL}/clientes/${id}.json`); 

  }

  getClientes(){
 
    return this.http.get(`${URL}/clientes.json`).pipe(
     map(this.arreglo)
   )
 
   }

   private arreglo(clientesObj:any){

    const clientes:ClienteModel[]=[];
    if (clientesObj === null) {
      return null;
    }
  
    for(let registro in clientesObj){
  
      clientesObj[registro].id = registro;
      clientes.push(clientesObj[registro]);
  
    }
   
    return clientes;
  
  }

  getReporteUsers(){
 
    return this.http.get(`${URL}/control.json`).pipe(
     map(this.arreglo)
   )
 
   }

  updateCliente(cliente:ClienteModel){

    const clienteTemp ={
      ...cliente
    }

    delete clienteTemp.id

    return this.http.put(`${URL}/clientes/${cliente.id}.json`, clienteTemp);

  }

  deleteCliente(id:string){

    return this.http.delete(`${URL}/clientes/${id}.json`);

  }

  verificarCelular(celular: string): Observable<boolean> {
    return this.getClientes().pipe(
      map((clientes: ClienteModel[] | null) => clientes ?? []), // Convierte null en un array vacío
      map((clientes: ClienteModel[]) => clientes.some(cliente => cliente.celular === celular))
    );
  }


  borrarTodosLosRegistros(): Observable<any> {
    return this.http.get('https://ruleta-angular-default-rtdb.firebaseio.com/control.json').pipe(
      switchMap((registros: any) => {
        // Obtén los registros y luego elimina cada uno
        const deleteRequests = Object.keys(registros).map(id => {
          return this.http.delete(`https://ruleta-angular-default-rtdb.firebaseio.com/control/${id}.json`);
        });
        // Combina todas las solicitudes DELETE en un solo observable
        return forkJoin(deleteRequests);
      })
    );
  }

}
