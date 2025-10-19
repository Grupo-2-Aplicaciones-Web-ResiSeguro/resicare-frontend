export class Profile {
    constructor({
        id = '',
        userId = '',
        nombre = '',
        edad = 0,
        residencia = '',
        correo = '',
        telefono = '',
        genero = '',
        nivelInstruccion = '',
        fotoDni = '',
        fotoCredencial = '',
        createdAt = null,
        bio = ''
    } = {}) {
        this.id = id
        this.userId = userId
        this.nombre = nombre
        this.edad = edad
        this.residencia = residencia
        this.correo = correo
        this.telefono = telefono
        this.genero = genero
        this.nivelInstruccion = nivelInstruccion
        this.fotoDni = fotoDni
        this.fotoCredencial = fotoCredencial
        this.createdAt = createdAt
        this.bio = bio
    }
}
