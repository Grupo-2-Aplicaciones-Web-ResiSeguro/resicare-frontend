/**
 * @summary API service for Claims (reclamos).
 * Uses shared http client to perform CRUD operations against json-server.
 * @author PARIONA LUCAS JOSE MANUEL - U202119257
 */

import { http } from '@/shared-kernel/infrastructure/http/http.js'

export class ClaimApiService {
  async getAll() {
    const response = await http.get('/claims')
    return response
  }

  async getById(id) {
    const response = await http.get(`/claims/${id}`)
    return response
  }

  async create(claim) {
    const response = await http.post('/claims', claim)
    return response
  }

  async update(id, claim) {
    const response = await http.patch(`/claims/${id}`, claim)
    return response
  }

  async delete(id) {
    const response = await http.delete(`/claims/${id}`)
    return response
  }
}
