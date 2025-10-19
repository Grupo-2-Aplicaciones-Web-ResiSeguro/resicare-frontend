import { http } from '@/shared-kernel/infrastructure/http/http.js'

export class ReminderApiService {
    async getAll() {
        const response = await http.get('/reminders')
        return response
    }

    async getById(id) {
        const response = await http.get(`/reminders/${id}`)
        return response
    }

    async getByUserId(userId) {
        const response = await http.get(`/reminders?userId=${userId}`)
        return response
    }

    async create(reminder) {
        const response = await http.post('/reminders', reminder)
        return response
    }

    async update(id, reminder) {
        const response = await http.patch(`/reminders/${id}`, reminder)
        return response
    }

    async delete(id) {
        const response = await http.delete(`/reminders/${id}`)
        return response
    }

    async search(query) {
        const response = await http.get(`/reminders?q=${query}`)
        return response
    }
}

