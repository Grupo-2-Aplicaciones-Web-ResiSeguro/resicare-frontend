import { Profile } from './profile.entity'

export class ProfileAssembler {
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.code}, ${response.message}`)
            return []
        }
        const profilesResponse = response.data
        return profilesResponse.map((profile) => this.toEntityFromResource(profile))
    }

    static toEntityFromResource(resource) {
        return new Profile(resource)
    }

    static fromUserRegisteredEvent(evt) {
        return new Profile({
            id: '', // puedes usar evt.data.userId como id del profile o generar uno
            userId: evt.data.userId,
            nombre: evt.data.nombre || '',
            correo: evt.data.email || '',
            edad: 0,
            residencia: '',
            fotoDni: '',
            fotoCredencial: '',
            createdAt: evt.data.createdAt || new Date().toISOString(),
            lastSyncedAt: new Date().toISOString()
        })
    }
}
