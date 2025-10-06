

export class Reminder {
    constructor({
                    id = null,
                    title = '',
                    type = '',
                    date = '',
                    time = '',
                    notes = '',
                    createdAt = null,
                    updatedAt = null,
                    userId = null
                } = {}) {
        this.id = id;        // Identificador único
        this.title = title;  // Nombre del recordatorio
        this.type = type;    // Tipo: medicación, chequeo, pago, etc.
        this.date = date;    // Fecha (YYYY-MM-DD)
        this.time = time;    // Hora (HH:mm)
        this.notes = notes;  // Notas opcionales
        this.createdAt = createdAt || new Date().toISOString()
        this.updatedAt = updatedAt || this.createdAt
        this.userId = userId
    }
}
