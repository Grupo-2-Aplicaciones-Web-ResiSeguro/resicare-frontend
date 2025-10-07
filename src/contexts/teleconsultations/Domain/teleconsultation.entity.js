export class Teleconsultation {
    constructor({
        id = '',
        service = '',
        date = '',
        time = '',
        description = '',
        userId = ''
    } = {}) {
        this.id = id
        this.service = service
        this.date = date
        this.time = time
        this.description = description // Motivo de la consulta
        this.userId = userId
    }
}
