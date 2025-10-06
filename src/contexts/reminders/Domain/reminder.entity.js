

export class Reminder {
    constructor(id, title, type, date, time, notes) {
        this.id = id;        // Identificador único
        this.title = title;  // Nombre del recordatorio
        this.type = type;    // Tipo: medicación, chequeo, pago, etc.
        this.date = date;    // Fecha (YYYY-MM-DD)
        this.time = time;    // Hora (HH:mm)
        this.notes = notes;  // Notas opcionales
    }
}
