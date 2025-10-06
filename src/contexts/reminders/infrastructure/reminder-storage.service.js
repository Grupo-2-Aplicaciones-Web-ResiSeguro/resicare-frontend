

const STORAGE_KEY = 'resicare_reminders';

export const ReminderStorageService = {
    // Obtener todos los recordatorios guardados
    getAll() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    // Guardar un nuevo recordatorio
    save(reminder) {
        const reminders = this.getAll();
        reminders.push(reminder);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
    },

    // Eliminar un recordatorio por ID
    delete(id) {
        const reminders = this.getAll().filter(r => r.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
    }
};
