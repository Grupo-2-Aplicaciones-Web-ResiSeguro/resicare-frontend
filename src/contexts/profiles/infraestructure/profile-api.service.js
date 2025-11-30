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
        const response = await http.get(`/api/profiles?userId=${userId}`)
        return response
    }

    async create(profile) {
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
