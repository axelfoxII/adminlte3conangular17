// ruleta.interface.ts
export interface Ruleta {
  id?: string; // Hacemos que 'id' sea opcional
  nombre: string;
  estado: boolean;
  cantidadPremios:number
  imagenURL: string;
  premios: any;
  tiros: number;
}