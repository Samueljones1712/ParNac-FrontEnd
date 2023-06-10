export interface Entrada {

    fecha: string;
    fk_idUsuario: string;
    fk_idParque: string;
    estado: string;
    id: number;
    fechaVencimiento: string;
    CantExtranjeros: number;
    CantNacionales: number;
    tarifaNacionales: number;
    tarifaExtranjeros: number;

    hora: string;
}
