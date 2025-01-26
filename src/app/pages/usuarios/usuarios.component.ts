import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginator } from '@angular/material/paginator';
import { ApiService } from '../../services/api.service';
import { UsuarioModel } from '../../models/usuario.model';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import * as bcrypt from 'bcryptjs';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, AfterViewInit {
  usuarios: UsuarioModel[] = [];
  dataSource!: MatTableDataSource<UsuarioModel>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  usuario:UsuarioModel ={
    id:'',
    nombre:'',
    email:'',
    password:'',
    rol:true,
    estado:true
  };
  newPassword:string = '';
  usuarioActivo:any = null;


  constructor(private apiSvc: ApiService, private paginatorIntl: MatPaginatorIntl) {
   
    // Personalizar el paginador al crearse el componente
    this.paginatorIntl.itemsPerPageLabel = 'Elementos por página:';
    this.paginatorIntl.nextPageLabel = 'Página siguiente';
    this.paginatorIntl.previousPageLabel = 'Página anterior';
    this.paginatorIntl.firstPageLabel = 'Primera página';
    this.paginatorIntl.lastPageLabel = 'Última página';
    this.paginatorIntl.getRangeLabel = this.customRangeLabel;
  }

  ngOnInit() {
    this.apiSvc.getUsuarios().subscribe({
      next: (usuariosData) => {
        const user = localStorage.getItem('currentUser');
        this.usuarioActivo = user ? JSON.parse(user):null;
      
        // Filtrar para excluir al usuario logueado
        this.usuarios = usuariosData.filter(usuario => usuario.email !== this.usuarioActivo?.email); 
        this.dataSource = new MatTableDataSource(this.usuarios);
        

        // Si dataSource está definido, asigna el paginador
        if (this.dataSource) {
          this.dataSource.paginator = this.paginator;
        }
      }
    });
  }

  ngAfterViewInit() {
    // Asigna el paginador una vez que esté disponible
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }

  displayedColumns: string[] = ['nombre', 'email','rol', 'estado', 'actions'];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Función personalizada para el rango del paginador
  private customRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`;
    }
    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  }


  cambiarEstado(usuario: UsuarioModel) {
    // Alternar el estado entre true y false
    usuario.estado = usuario.estado === true ? false : true;
  
    // Actualizar en Firebase
    this.apiSvc.actualizarEstadoUsuario(usuario).subscribe({
      next: (res) => {
        // Refrescar la tabla con los datos actualizados
        this.dataSource.data = [...this.usuarios];
      },
      error: (error) => {
        console.error('Error al cambiar el estado:', error);
      }
    });
  }


  cambiarRol(usuario: UsuarioModel) {
    // Alternar el estado entre true y false
    usuario.rol = usuario.rol === true ? false : true;
  
    // Actualizar en Firebase
    this.apiSvc.actualizarRolUsuario(usuario).subscribe({
      next: (res) => {
        // Refrescar la tabla con los datos actualizados
        this.dataSource.data = [...this.usuarios];
      },
      error: (error) => {
        console.error('Error al cambiar el estado:', error);
      }
    });
  }
  

  crearUsuario(forma: NgForm) {
   
    if (forma.invalid) {
      Swal.fire('Error', 'Formulario no válido. Por favor completa todos los campos.', 'error');
      return;
    }
  
   console.log(forma.value)
  
    // Validar si las contraseñas coinciden
    if (forma.value.password !== forma.value.password2) {
      Swal.fire('Error', 'Confirmar password no es igual', 'error');
      return;
    }else{
      const saltRounds = 10;
      this.newPassword = forma.value.password;
      // Construir objeto usuario
    this.usuario = {
      nombre:forma.value.nombre,
      email:forma.value.email,
      password:bcrypt.hashSync(this.newPassword.trim(), saltRounds),
      rol:true,
      estado:true
    };
    }
  
    // Verificar si el email ya existe
    this.apiSvc.verificarEmail(this.usuario.email).subscribe((existe: boolean) => {
      if (existe) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El correo electrónico ya existe',
        });
      } else {
        // Crear usuario si el email no existe
        this.apiSvc.crearUsuario(this.usuario).subscribe({
          next: (res) => {           
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'El usuario se creó correctamente',
            }).then((result)=>{
              if (result) {
                forma.resetForm(); // Limpiar el formulario
                location.reload();
              }
            })
          },
          error: (error) => {
            console.error('Error al crear usuario:', error);
            Swal.fire('Error', 'Hubo un problema al crear el usuario', 'error');
          }
        });
      }
    });
  }
  
  
  obtenerDataUsuario(id: any) {
    this.apiSvc.getUsuario(id).subscribe({
      next: (res:UsuarioModel) => {
          
        this.usuario = {
          id,
          nombre: res.nombre,
          email: res.email,
          password: res.password,
          estado: res.estado
        };
  
        console.log(this.usuario);
      },
      error: (err) => {
        console.log('Error:', err);
      }
    });
  }

  editarUsuario(form: NgForm) {
    const nuevoNombre = form.value.nombre?.trim() ?? '';
    const nuevoPassword = form.value.password2?.trim() ?? '';
    const passwordAntiguo = form.value.password?.trim() ?? '';
  
    console.log('Nuevo nombre:', nuevoNombre, 'Nuevo password:', nuevoPassword, 'Password antiguo:', passwordAntiguo);
  
    // Si solo cambia el nombre
    if (nuevoNombre && nuevoNombre !== JSON.stringify(this.usuario.nombre) && !nuevoPassword && !passwordAntiguo) {
      const usuarioActualizado: UsuarioModel = {
        id: this.usuario.id,
        nombre: nuevoNombre,
      };
  
      console.log('Actualizando solo el nombre:', usuarioActualizado);
      this.actualizarUsuarioEnServidor(usuarioActualizado);
      return;
    }
  
    // Si cambia el password (con o sin cambiar el nombre)
    if (nuevoPassword && passwordAntiguo) {
      const storedPassword = this.usuario.password ?? '';
      const isMatch = bcrypt.compareSync(passwordAntiguo, storedPassword);
  
      if (!isMatch) {
        Swal.fire({
          icon: 'error',
          title: 'El password antiguo no es correcto!',
          text: 'Por favor, ingrese el password antiguo correcto',
        });
        console.error('Error: El password antiguo no coincide.');
        return;
      }
  
      const saltRounds = 10;
      const usuarioActualizado: UsuarioModel = {
        id: this.usuario.id,
        nombre: nuevoNombre || this.usuario.nombre, // Si no cambia el nombre, usa el actual
        password: bcrypt.hashSync(nuevoPassword, saltRounds),
      };
  
      console.log('Actualizando nombre y/o contraseña:', usuarioActualizado);
      this.actualizarUsuarioEnServidor(usuarioActualizado);
      return;
    }
  
    // Si no se detectan cambios
    Swal.fire({
      icon: 'info',
      title: 'Sin cambios',
      text: 'No se detectaron cambios para actualizar.',
    });
    console.log('No se detectaron cambios.');
  }
  
  private actualizarUsuarioEnServidor(usuario: UsuarioModel) {
    this.apiSvc.actualizarUsuario(usuario).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Usuario actualizado correctamente!',
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        });
        console.log('Usuario actualizado exitosamente:', usuario);
        this.usuario = { ...this.usuario, ...usuario }; // Actualiza localmente solo los campos modificados
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al actualizar el usuario.',
        });
        console.error('Error al actualizar el usuario:', err);
      },
    });
  }

  
  borrarUsuario(usuario: UsuarioModel) {
    
    Swal.fire({
      icon: 'question',
      title: '¿Desea eliminar el usuario?',
      text: `Esta operación no puede deshacerse...`,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar"
    }).then((res) => {
      if (res.isConfirmed) {
            
        // Llamar al servicio para eliminar el usuario en el backend
        this.apiSvc.borrarUsuario(usuario.id).subscribe({
          next: () => {
            // Notificación de éxito
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El usuario fue eliminado correctamente.',
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
              text: 'Ocurrió un error al eliminar el usuario.',
            });
            console.error('Error al eliminar el usuario:', err);
                             
          }
        });
      }
    });
  }
  


  limpiarForm(forma:NgForm){

    forma.reset();

  }







}
