import { http } from '@/shared-kernel/infrastructure/http/http.js'

export class ProfileApiService {
    async getAll() {
        const response = await http.get('/profiles')
        return response
    }

    async getById(id) {
        const response = await http.get(`/profiles/${id}`)
        return response
    }

    async create(profile) {
        // profile es una instancia de Profile
        const response = await http.post('/profiles', profile)
        return response
    }

    async update(id, profile) {
        const response = await http.patch(`/profiles/${id}`, profile)
        return response
    }

    async delete(id) {
        const response = await http.delete(`/profiles/${id}`)
        return response
    }
}
