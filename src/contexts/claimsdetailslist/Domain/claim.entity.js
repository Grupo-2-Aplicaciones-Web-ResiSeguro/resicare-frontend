/**
 * @summary Claim entity representing a user claim (reclamo).
 * @author PARIONA LUCAS JOSE MANUEL - U202119257
 */

export class Claim {
  /**
   * Create a Claim
   * @param {Object} props
   */
  constructor(props = {}) {
    this.id = props.id || ''
    this.number = props.number || ''
    this.type = props.type || ''
    this.status = props.status || ''
    this.incidentDate = props.incidentDate || ''
    this.creationDate = props.creationDate || ''
    this.description = props.description || ''
    this.objectRegistered = props.objectRegistered || null
  }
}
