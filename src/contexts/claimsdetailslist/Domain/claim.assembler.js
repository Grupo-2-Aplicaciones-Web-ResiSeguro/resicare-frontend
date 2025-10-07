/**
 * @summary Assembler for Claim domain objects.
 * Transforms raw API payloads into Claim entities.
 * @author PARIONA LUCAS JOSE MANUEL - U202119257
 */

import { Claim } from './claim.entity.js'

export const claimFromApi = (raw) => {
  return new Claim({
    id: raw.id,
    number: raw.number,
    type: raw.type,
    status: raw.status,
    incidentDate: raw.incidentDate,
    creationDate: raw.creationDate,
    description: raw.description,
    objectRegistered: raw.objectRegistered || null,
  })
}
