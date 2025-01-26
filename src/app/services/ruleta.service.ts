import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Ruleta } from '../interfaces/ruleta.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RuletaService {

  URL = environment.urlServer;

  constructor(private http:HttpClient) { }


  getRuletas():Observable<Ruleta[] | null>{
    return this.http.get<Ruleta[]>(`${this.URL}/ruleta.json`).pipe(
         map(this.arreglo)
       );

  }

  getRuleta(id:any):Observable<Ruleta>{
   
    return this.http.get<Ruleta>(`${this.URL}/ruleta/${id}.json`); 

  }


  private arreglo(ruletasObj: any): Ruleta[] | null {
    const ruletas: Ruleta[] = [];
    if (ruletasObj === null) {
      return null;
    }
  
    for (let registro in ruletasObj) {
      const ruleta = ruletasObj[registro];
  
      // Transformar premios en un arreglo
      const premiosTransformados = Object.entries(ruleta.premios).map(([rango, premio]: [string, any]) => ({
        rango,
        ...premio
      }));
  
      ruleta.id = registro;
      ruleta.premios = premiosTransformados;
      ruletas.push(ruleta);
    }
  
    return ruletas;
  }
  
  crearRuleta(ruleta:Ruleta){
  
    return this.http.post(`${this.URL}/ruleta.json`, ruleta ).pipe(
      map((res:any)=>{
        ruleta.id = res.name;
        return ruleta;
      })
    )
  
  }

  borrarRuleta(id:any){
    return this.http.delete(`${this.URL}/ruleta/${id}.json`);
  }

  actualizarEstadoRuleta(ruleta: Ruleta) {
    return this.http.put(`${this.URL}/ruleta/${ruleta.id}.json`, ruleta);
  }
  


}
