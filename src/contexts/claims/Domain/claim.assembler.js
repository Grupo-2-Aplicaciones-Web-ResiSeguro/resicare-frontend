import { Claim } from './claim.entity'

export class ClaimAssembler {
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.code}, ${response.message}`)
            return []
        }
        const claimsResponse = response.data
        return claimsResponse.map((claim) => this.toEntityFromResource(claim))
    }

    static toEntityFromResource(resource) {
        return new Claim(resource)
    }

    static toResourceFromEntity(claim) {
        return {
            tipo: claim.tipo,
            fechaIncidente: claim.fechaIncidente,
            descripcionBreve: claim.descripcionBreve,
            objetoRegistrado: claim.objetoRegistrado,
            fotosDocumentos: claim.fotosDocumentos,
            estado: claim.estado,
            fechaCreacion: claim.fechaCreacion
        }
    }
}
