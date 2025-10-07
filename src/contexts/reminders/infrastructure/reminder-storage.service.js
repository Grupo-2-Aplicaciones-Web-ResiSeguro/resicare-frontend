const STORAGE_KEY = 'resicare_reminders';

const safeParse = (str) => {
    try { return JSON.parse(str); } catch (e) { return null; }
};

export const ReminderStorageService = {
    getAll() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? safeParse(data) || [] : [];
    },

    findById(id) {
        if (!id) return null;
        return this.getAll().find(r => String(r.id) === String(id)) || null;
    },

    save(reminder) {
        // reminder: objeto completo, se asume que ya tiene id
        const reminders = this.getAll();
        const idx = reminders.findIndex(r => String(r.id) === String(reminder.id));
        if (idx >= 0) {
            reminder.updatedAt = new Date().toISOString();
            reminders[idx] = reminder;
        } else {
            // si no tiene id, no lo dejamos (id debe ser creado antes de llamar save)
            reminders.push(reminder);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
    },

    create(reminder) {
        // crea y devuelve el reminder con id si no tiene.
        const id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `r-${Date.now()}`;
        // Asegura que el userId esté presente
        let userId = reminder.userId
        if (!userId) {
            try {
                const currentUserRaw = localStorage.getItem('currentUser')
                if (currentUserRaw) {
                    const parsed = JSON.parse(currentUserRaw)
                    userId = parsed.id ?? parsed.userId ?? parsed.sub ?? parsed.uid ?? null
                }
            } catch {}
        }
        const toSave = {
            ...reminder,
            id,
            createdAt: reminder.createdAt || new Date().toISOString(),
            updatedAt: reminder.updatedAt || new Date().toISOString(),
            userId
        };
        const reminders = this.getAll();
        reminders.push(toSave);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
        return toSave;
    },

    update(reminder) {
        if (!reminder || !reminder.id) return null;
        const reminders = this.getAll();
        const idx = reminders.findIndex(r => String(r.id) === String(reminder.id));
        if (idx < 0) return null;
        reminder.updatedAt = new Date().toISOString();
        reminders[idx] = reminder;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
        return reminder;
    },

    delete(id) {
        const reminders = this.getAll().filter(r => String(r.id) !== String(id));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
    },

    clearAll() {
        localStorage.removeItem(STORAGE_KEY);
    }
};
