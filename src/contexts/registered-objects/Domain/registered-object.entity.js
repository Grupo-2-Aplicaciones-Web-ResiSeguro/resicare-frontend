export class RegisteredObject {
    constructor({
                    id = '',
                    tipo = '', // Electrónico, Maleta, Libros, Útiles, Otros
                    nombre = '',
                    descripcionBreve = '',
                    precio = 0,
                    numeroSerie = '',
                    foto = '',
                    fechaRegistro = new Date().toISOString(),
                    userId = ''
                }) {
        this.id = id
        this.tipo = tipo
        this.nombre = nombre
        this.descripcionBreve = descripcionBreve
        this.precio = precio
        this.numeroSerie = numeroSerie
        this.foto = foto
        this.fechaRegistro = fechaRegistro
        this.userId = userId
    }
}
