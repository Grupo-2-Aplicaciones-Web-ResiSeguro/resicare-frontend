import { Consultation } from './teleconsultation.entity.js'

export class ConsultationAssembler {
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.code}, ${response.message}`)
            return []
        }
        const consultationsResponse = response.data
        return consultationsResponse.map((consultation) => this.toEntityFromResource(consultation))
    }

    static toEntityFromResource(resource) {
        return new Consultation(resource)
    }
}
