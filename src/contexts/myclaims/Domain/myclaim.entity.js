export class MyClaim {
    constructor({
                    id = '',
                    tipo = '', // Accidente, Robo, Pérdida, Daños
                    fechaIncidente = '',
                    descripcionBreve = '',
                    objetoRegistrado = '',
                    fotosDocumentos = [],
                    estado = 'pendiente', // pendiente, en revisión, aprobado, rechazado
                    fechaCreacion = new Date().toISOString(),
                }) {
        this.id = id
        this.tipo = tipo
        this.fechaIncidente = fechaIncidente
        this.descripcionBreve = descripcionBreve
        this.objetoRegistrado = objetoRegistrado
        this.fotosDocumentos = fotosDocumentos
        this.estado = estado
        this.fechaCreacion = fechaCreacion
    }
}