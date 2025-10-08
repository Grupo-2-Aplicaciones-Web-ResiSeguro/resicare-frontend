import { http } from '@/shared-kernel/infrastructure/http/http.js'

export class RegisteredObjectApiService {
    async getAll() {
        const response = await http.get('/registeredObjects')
        return response
    }

    async getById(id) {
        const response = await http.get(`/registeredObjects/${id}`)
        return response
    }

    async getByUserId(userId) {
        const response = await http.get(`/registeredObjects?userId=${userId}`)
        return response
    }

    async create(registeredObject) {
        const response = await http.post('/registeredObjects', registeredObject)
        return response
    }

    async update(id, registeredObject) {
        const response = await http.patch(`/registeredObjects/${id}`, registeredObject)
        return response
    }

    async delete(id) {
        const response = await http.delete(`/registeredObjects/${id}`)
        return response
    }

    async search(query) {
        const response = await http.get(`/registeredObjects?q=${query}`)
        return response
    }
}
