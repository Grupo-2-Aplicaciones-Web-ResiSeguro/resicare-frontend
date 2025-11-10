import { http } from '@/shared-kernel/infrastructure/http/http.js'

export class ReminderApiService {
    async getAll() {
        const response = await http.get('/api/reminders')
        return response
    }

    async getById(id) {
        const response = await http.get(`/api/reminders/${id}`)
        return response
    }

    async getByUserId(userId) {
        const response = await http.get(`/api/reminders?userId=${userId}`)
        return response
    }

    async create(reminder) {
        const response = await http.post('/api/reminders', reminder)
        return response
    }

    async update(id, reminder) {
        const response = await http.patch(`/api/reminders/${id}`, reminder)
        return response
    }

    async delete(id) {
        const response = await http.delete(`/api/reminders/${id}`)
        return response
    }

    async search(query) {
        const response = await http.get(`/api/reminders?q=${query}`)
        return response
    }
}

