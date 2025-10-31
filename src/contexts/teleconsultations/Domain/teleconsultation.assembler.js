import { Teleconsultation } from './teleconsultation.entity.js'

export class ConsultationAssembler {
    static toEntitiesFromResponse(response) {
        if (!response || typeof response.status !== 'number' || response.status < 200 || response.status >= 300) {
            console.error(`${response?.status}, ${response?.code}, ${response?.message}`)
            return []
        }
        const consultationsResponse = response.data
        if (!Array.isArray(consultationsResponse)) return []
        return consultationsResponse.map((consultation) => this.toEntityFromResource(consultation))
    }

    static toEntityFromResource(resource = {}) {
        return new Teleconsultation({
            id: resource.id ?? resource.Id ?? null,
            service: resource.service ?? resource.Service ?? '',
            date: resource.date ?? resource.Date ?? '',
            time: resource.time ?? resource.Time ?? '',
            description: resource.description ?? resource.Description ?? '',
            userId: resource.userId ?? resource.UserId ?? null
        })
    }

    static toResourceFromEntity(consultation) {
        return {
            id: consultation.id ?? null,
            service: consultation.service ?? '',
            date: consultation.date ?? '',
            time: consultation.time ?? '',
            description: consultation.description ?? '',
            userId: consultation.userId ?? null
        }
    }
}