export class Profile {
    constructor({
                    id = '',
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
                }) {
        this.id = id
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
    }
}
