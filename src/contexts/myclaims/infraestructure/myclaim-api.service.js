import { http } from '@/shared-kernel/infrastructure/http/http.js'
import { MyClaimAssembler } from '../domain/myclaim.assembler.js'

class MyClaimApiService {
  async fetchAll() {
    const response = await http.get('/myclaims')
    // Corrige: axios retorna { data: [...] }
    return Array.isArray(response.data)
      ? response.data.map(MyClaimAssembler.fromApiResponse)
      : []
  }

  async fetchById(id) {
    const response = await http.get(`/myclaims/${id}`)
    return MyClaimAssembler.fromApiResponse(response.data)
  }

  async create(myClaim) {
    const response = await http.post('/myclaims', myClaim)
    return response.data
  }

  async update(id, myClaim) {
    const response = await http.patch(`/myclaims/${id}`, myClaim)
    return response.data
  }

  async delete(id) {
    const response = await http.delete(`/myclaims/${id}`)
    return response.data
  }
}

export const MyClaimApiServiceInstance = new MyClaimApiService()
export { MyClaimApiService }
