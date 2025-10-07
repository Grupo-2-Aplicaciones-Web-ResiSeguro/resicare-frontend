import { Claim } from './claim.entity.js'

export class ClaimAssembler {
  static toEntitiesFromResponse(response) {
    if (response.status !== 200) {
      console.error(`${response.status}, ${response.statusText}`)
      return []
    }
    const claimsResponse = response.data
    return claimsResponse.map((claim) => this.toEntityFromResource(claim))
  }

  static toEntityFromResource(resource) {
    return new Claim({
      id: resource.id,
      number: resource.number,
      type: resource.type,
      status: resource.status,
      incidentDate: resource.incidentDate,
      creationDate: resource.creationDate,
      description: resource.description,
      objectRegistered: resource.objectRegistered,
      documents: resource.documents || [],
      userId: resource.userId
    })
  }

  static toResourceFromEntity(claim) {
    return {
      type: claim.type,
      incidentDate: claim.incidentDate,
      description: claim.description,
      objectRegistered: claim.objectRegistered,
      documents: claim.documents,
      status: claim.status,
      creationDate: claim.creationDate,
      userId: claim.userId
    }
  }
}
