import { http } from '@/shared-kernel/infrastructure/http/http.js'

export class TeleconsultationApiService {
    async getAll() {
        const response = await http.get('/api/teleconsultations')
        return response
    }

    async getById(id) {
        const response = await http.get(`/api/teleconsultations/${id}`)
        return response
    }

    async getByUserId(userId) {
        const response = await http.get(`/api/teleconsultations?userId=${userId}`)
        return response
    }

    async create(consultation) {
        const response = await http.post('/api/teleconsultations', consultation)
        return response
    }

    async update(id, consultation) {
        const response = await http.put(`/api/teleconsultations/${id}`, consultation)
        return response
    }

    async delete(id) {
        const response = await http.delete(`/api/teleconsultations/${id}`)
        return response
    }
}
