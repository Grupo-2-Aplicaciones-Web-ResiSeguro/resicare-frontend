import { http } from '@/shared-kernel/infrastructure/http/http.js'

export class ReimbursementSimulatorApiService {
    async getAll() {
        const response = await http.get('/simulators')
        return response
    }

    async getById(id) {
        const response = await http.get(`/simulators/${id}`)
        return response
    }

    async create(simulator) {
        const response = await http.post('/simulators', simulator)
        return response
    }

    async update(id, simulator) {
        const response = await http.patch(`/simulators/${id}`, simulator)
        return response
    }

    async delete(id) {
        const response = await http.delete(`/simulators/${id}`)
        return response
    }
}
