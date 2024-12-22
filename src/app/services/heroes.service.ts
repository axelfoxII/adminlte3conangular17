import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Heroes } from '../interfaces/heroes.interface';


@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  constructor(private http:HttpClient) {}

  private URL ='http://localhost:3000';

 


  obtenerHeroes():Observable<Heroes[]>{

    return this.http.get<Heroes[]>(`${this.URL}/heroes`);

  }

 

}
