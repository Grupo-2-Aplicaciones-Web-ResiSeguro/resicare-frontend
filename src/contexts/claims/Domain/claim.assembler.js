import { Claim } from './claim.entity.js'

export class ClaimAssembler {
  static toEntitiesFromResponse(response) {
    if (!response || typeof response.status !== 'number' || response.status < 200 || response.status >= 300) {
      console.error(`${response?.status}, ${response?.statusText}`)
      return []
    }
    const data = response.data ?? []
    if (Array.isArray(data)) {
      return data.map((claim) => this.toEntityFromResource(claim))
    }
    // si backend devuelve un objeto único
    return [this.toEntityFromResource(data)]
  }

  static toEntityFromResource(resource) {
    // Incluir todos los campos presentes en db.json (rating, number, etc.)
    return new Claim({
      id: resource.id ?? resource._id ?? '',
      number: resource.number ?? '',
      type: resource.type ?? '',
      status: resource.status ?? 'pending',
      incidentDate: resource.incidentDate ?? '',
      creationDate: resource.creationDate ?? resource.createdAt ?? new Date().toISOString(),
      description: resource.description ?? '',
      objectRegistered: resource.objectRegistered ?? null,
      documents: resource.documents || [],
      userId: resource.userId ?? resource.user_id ?? '',
      rating: resource.rating ?? null
    })
  }

  static toResourceFromEntity(claim) {
    // serializar todos los campos que deben persistir en db.json
    return {
      id: claim.id,
      number: claim.number,
      type: claim.type,
      status: claim.status,
      incidentDate: claim.incidentDate,
      creationDate: claim.creationDate,
      description: claim.description,
      objectRegistered: claim.objectRegistered,
      documents: claim.documents,
      userId: claim.userId,
      rating: claim.rating ?? null
    }
  }
}
