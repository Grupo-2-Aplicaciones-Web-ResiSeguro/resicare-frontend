export class Profile {
    constructor({
        id = '',
        userId = '',
        nombre = '',
        edad = 0,
        residencia = '',
        correo = '',
        telefono = '',
        contrasena = '',
        genero = '',
        nivelInstruccion = '',
        fotoDni = '',
        fotoCredencial = '',
        createdAt = null,
        lastSyncedAt = null
    } = {}) {
        this.id = id
        this.userId = userId
        this.nombre = nombre
        this.edad = edad
        this.residencia = residencia
        this.correo = correo
        this.telefono = telefono
        this.contrasena = contrasena
        this.genero = genero
        this.nivelInstruccion = nivelInstruccion
        this.fotoDni = fotoDni
        this.fotoCredencial = fotoCredencial
        this.createdAt = createdAt
        this.lastSyncedAt = lastSyncedAt
    }
}

