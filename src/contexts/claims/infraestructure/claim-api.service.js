import { http } from '@/shared-kernel/infrastructure/http/http.js'

export class ClaimApiService {
  async getAll() {
    const response = await http.get('/api/claims')
    return response
  }

  async getByUserId(userId) {
    const response = await http.get(`/api/claims?userId=${userId}`)
    return response
  }

  async getById(id) {
    const response = await http.get(`/api/claims/${id}`)
    return response
  }

  async create(claim) {
    const response = await http.post('/api/claims', claim)
    return response
  }

  async update(id, claim) {
    const response = await http.patch(`/api/claims/${id}`, claim)
    return response
  }

  async delete(id) {
    const response = await http.delete(`/api/claims/${id}`)
    return response
  }

  async rate(id, rating) {
    const response = await http.patch(`/api/claims/${id}`, { rating })
    return response
  }
}
