import { Teleconsultation } from './teleconsultation.entity.js'

export class ConsultationAssembler {
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.code}, ${response.message}`)
            return []
        }
        const consultationsResponse = response.data
        return consultationsResponse.map((consultation) => this.toEntityFromResource(consultation))
    }

    static toEntityFromResource(resource = {}) {
        return new Teleconsultation({
            id: resource.id,
            service: resource.service,
            date: resource.date,
            time: resource.time,
            description: resource.description,
            userId: resource.userId || ''
        })
    }
}
