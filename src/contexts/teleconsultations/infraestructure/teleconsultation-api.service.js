import { http } from '@/shared-kernel/infrastructure/http/http.js'

export class TeleconsultationApiService {
    async getAll() {
        const response = await http.get('/consultations')
        return response
    }

    async getById(id) {
        const response = await http.get(`/consultations/${id}`)
        return response
    }

    async create(consultation) {
        const response = await http.post('/consultations', consultation)
        return response
    }

    async update(id, consultation) {
        const response = await http.patch(`/consultations/${id}`, consultation)
        return response
    }

    async delete(id) {
        const response = await http.delete(`/consultations/${id}`)
        return response
    }
}
