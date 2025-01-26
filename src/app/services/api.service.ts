import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { UsuarioModel } from '../models/usuario.model';



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private URL = environment.urlServer;
  constructor(private http:HttpClient) { }

  
  crearUsuario(usuario:UsuarioModel){

    return this.http.post(`${this.URL}/usuarios.json`, usuario).pipe(

      map((res:any)=>{

        usuario.id = res.name;
        return usuario;

      })

    )


  }

  getUsuarios(){

    return this.http.get(`${this.URL}/usuarios.json`).pipe(
      map(this.arreglo)
    );

  }

  private arreglo(usuariosObj:any):UsuarioModel[]{

    const usuarios:UsuarioModel[]=[];

    if (usuariosObj === null) {
      return usuarios;
    }

    for(let registro in usuariosObj){

      usuariosObj[registro].id = registro;
      usuarios.push(usuariosObj[registro]);


    }

    return usuarios;

  }


  getUsuario(id:string){

    return this.http.get(`${this.URL}/usuarios/${id}.json`);

  }

  actualizarEstadoUsuario(usuario: UsuarioModel) {
    return this.http.put(`${this.URL}/usuarios/${usuario.id}.json`, usuario);
  }

  actualizarRolUsuario(usuario: UsuarioModel) {
    return this.http.put(`${this.URL}/usuarios/${usuario.id}.json`, usuario);
  }

  
  actualizarUsuario(usuario:UsuarioModel){

    const usuarioTemp = {...usuario};
    delete usuarioTemp.id;

    return this.http.patch(`${this.URL}/usuarios/${usuario.id}.json`,usuarioTemp);

  }

  verificarEmail(email:any){

    return this.getUsuarios().pipe(

      map((usuarios:UsuarioModel[])=>{

        return usuarios.some(usuario => usuario.email === email);

      })

    )

  }

  borrarUsuario(id:any){
    return this.http.delete(`${this.URL}/usuarios/${id}.json`);
  }

}
