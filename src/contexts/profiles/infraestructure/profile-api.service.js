import { http } from '@/shared-kernel/infrastructure/http/http.js'

export class ProfileApiService {
    async getAll() {
        const response = await http.get('/api/profiles')
        return response
    }

    async getById(id) {
        const response = await http.get(`/api/profiles/${id}`)
        return response
    }

    async getByUserId(userId) {
        // permite consultar por userId; backend puede devolver array o recurso
        const response = await http.get(`/api/profiles?userId=${userId}`)
        return response
    }

    async create(profile) {
        // profile es una instancia de Profile
        const response = await http.post('/api/profiles', profile)
        return response
    }

    async update(id, profile) {
        const response = await http.patch(`/api/profiles/${id}`, profile)
        return response
    }

    async delete(id) {
        const response = await http.delete(`/api/profiles/${id}`)
        return response
    }
}
