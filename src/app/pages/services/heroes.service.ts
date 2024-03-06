import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Heroes } from '../../interfaces/heroes.interface';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private URL='http://localhost:3000'
  constructor(private http:HttpClient) { }

  obtenerHeroes():Observable<Heroes[]>{

    return this.http.get<Heroes[]>(`${this.URL}/heroes`);

  }

}
