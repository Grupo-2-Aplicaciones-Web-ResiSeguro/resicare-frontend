import { http } from '@/shared-kernel/infrastructure/http/http.js'
import { MyClaimAssembler } from '../domain/myclaim.assembler.js'

export class MyClaimApiService {
  async getAll() {
    const response = await http.get('/myclaims')
    // Transforma la respuesta con el assembler si existe
    return Array.isArray(response)
      ? response.map(MyClaimAssembler.fromApiResponse)
      : []
  }

  async getById(id) {
    const response = await http.get(`/myclaims/${id}`)
    return MyClaimAssembler.fromApiResponse(response)
  }

  async create(myClaim) {
    const response = await http.post('/myclaims', myClaim)
    return response
  }

  async update(id, myClaim) {
    const response = await http.patch(`/myclaims/${id}`, myClaim)
    return response
  }

  async delete(id) {
    const response = await http.delete(`/myclaims/${id}`)
    return response
  }
}
