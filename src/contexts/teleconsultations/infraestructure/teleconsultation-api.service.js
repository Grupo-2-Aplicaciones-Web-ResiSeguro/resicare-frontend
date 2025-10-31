import { http } from '@/shared-kernel/infrastructure/http/http.js'

export class TeleconsultationApiService {
    async getAll() {
        const response = await http.get('/teleconsultations')
        return response
    }

    async getById(id) {
        const response = await http.get(`/teleconsultations/${id}`)
        return response
    }

    async create(consultation) {
        const response = await http.post('/teleconsultations', consultation)
        return response
    }

    async update(id, consultation) {
        const response = await http.patch(`/teleconsultations/${id}`, consultation)
        return response
    }

    async delete(id) {
        const response = await http.delete(`/teleconsultations/${id}`)
        return response
    }
}
