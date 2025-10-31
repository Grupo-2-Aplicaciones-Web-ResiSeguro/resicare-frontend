import { http } from '@/shared-kernel/infrastructure/http/http.js'

export class ReminderApiService {
    async getAll() {
        const response = await http.get('/reminders')
        return response
    }

    async getById(id) {
        const response = await http.get(`/reminders/${Number(id)}`)
        return response
    }

    async getByUserId(userId) {
        // asegurar que el userId en la query sea numérico
        const uid = Number(userId)
        const response = await http.get(`/reminders?userId=${uid}`)
        return response
    }

    async create(reminder) {
        // no enviar id para que json-server asigne un id numérico
        const payload = { ...reminder }
        if (payload.id !== undefined) delete payload.id
        if (payload.userId !== undefined) payload.userId = Number(payload.userId)
        const response = await http.post('/reminders', payload)
        return response
    }

    async update(id, reminder) {
        const payload = { ...reminder }
        if (payload.userId !== undefined) payload.userId = Number(payload.userId)
        const response = await http.patch(`/reminders/${Number(id)}`, payload)
        return response
    }

    async delete(id) {
        const response = await http.delete(`/reminders/${Number(id)}`)
        return response
    }

    async search(query) {
        const response = await http.get(`/reminders?q=${encodeURIComponent(query)}`)
        return response
    }
}
