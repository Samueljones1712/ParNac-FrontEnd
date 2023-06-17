export interface RegistroActividad {

    id: number;
    pk_idUsuario: number;
    detalle: string;
    fechaHora: string;
    ipAddress: string;

}

export interface RegistroActividadVista {

    id: number;
    pk_idUsuario: number;
    correo: string;
    detalle: string;
    fechaHora: string;
    ipAddress: string;
    nombreCompleto: string;
}