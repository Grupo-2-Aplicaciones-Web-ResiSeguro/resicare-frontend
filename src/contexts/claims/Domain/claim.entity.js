export class Claim {
  constructor({
    id = '',
    number = '',
    type = '',              // accident, theft, loss, damage
    status = 'pending',     // pending, in_review, approved, rejected
    incidentDate = '',
    creationDate = new Date().toISOString(),
    description = '',
    objectRegistered = null,
    documents = [],
    userId = '',
    rating = null
  } = {}) {
    this.id = id
    this.number = number
    this.type = type
    this.status = status
    this.incidentDate = incidentDate
    this.creationDate = creationDate
    this.description = description
    this.objectRegistered = objectRegistered
    this.documents = documents
    this.userId = userId
    this.rating = rating
  }
}
