import { http } from '@/shared-kernel/infrastructure/http/http.js'

export class RegisteredObjectApiService {
    async getAll() {
        const response = await http.get('/registered-objects')
        return response
    }

    async getById(id) {
        const response = await http.get(`/registered-objects/${id}`)
        return response
    }

    async getByUserId(userId) {
        const response = await http.get(`/registered-objects?userId=${userId}`)
        return response
    }

    async create(registeredObject) {
        const response = await http.post('/registered-objects', registeredObject)
        return response
    }

    async update(id, registeredObject) {
        const response = await http.patch(`/registered-objects/${id}`, registeredObject)
        return response
    }

    async delete(id) {
        const response = await http.delete(`/registered-objects/${id}`)
        return response
    }

    async search(query) {
        const response = await http.get(`/registered-objects?q=${query}`)
        return response
    }
}