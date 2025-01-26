export class ClienteModel{
    id?: string;
    celular?: string;
    premio?: string;
    estado?: boolean;
    trampa?:boolean;
    fecha?: any;

    constructor(){
        this.estado= false;
        this.trampa= false;
       
    }
}