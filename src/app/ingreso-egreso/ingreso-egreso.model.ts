import { IngresoEgresoInterface } from "./ingreso-egreso.interface";

export class IngresoEgreso {
    uid: string;
    descripcion: string;
    monto: number;
    tipo: string;

    constructor(obj: IngresoEgresoInterface) {
        this.descripcion = obj && obj.descripcion || null;
        this.monto = obj && obj.monto || null;
        this.tipo = obj && obj.tipo || null;
    }
}