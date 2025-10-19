import { Profile } from './profile.entity'

function optToString(opt) {
    if (opt == null) return ''
    if (typeof opt === 'string') return opt
    if (typeof opt === 'object') return (opt.value ?? opt.label ?? '')
    return String(opt)
}

export class ProfileAssembler {
    static toEntitiesFromResponse(response) {
        // aceptar cualquier 2xx
        if (!response || typeof response.status !== 'number' || response.status < 200 || response.status >= 300) {
            console.error(`${response?.status}, ${response?.code}, ${response?.message}`)
            return []
        }
        const profilesResponse = response.data
        if (!Array.isArray(profilesResponse)) return []
        return profilesResponse.map((profile) => this.toEntityFromResource(profile))
    }

    static toEntityFromResource(resource = {}) {
        // normalizar campos que pueden venir como {label,value} o string
        return new Profile({
            id: resource.id ?? resource._id ?? '',
            userId: resource.userId ?? resource.user_id ?? '',
            nombre: resource.nombre ?? resource.name ?? '',
            correo: resource.correo ?? resource.email ?? '',
            edad: resource.edad ?? resource.age ?? 0,
            residencia: resource.residencia ?? resource.residence ?? '',
            telefono: resource.telefono ?? resource.phone ?? '',
            genero: optToString(resource.genero),
            nivelInstruccion: optToString(resource.nivelInstruccion),
            fotoDni: resource.fotoDni ?? resource.foto_dni ?? '',
            fotoCredencial: resource.fotoCredencial ?? resource.foto_credencial ?? '',
            createdAt: resource.createdAt ?? resource.created_at ?? null,
            bio: resource.bio ?? resource.biography ?? ''
        })
    }

    static fromUserRegisteredEvent(evt) {
        return new Profile({
            id: '',
            userId: evt.data.userId,
            nombre: evt.data.nombre || '',
            correo: evt.data.email || '',
            edad: 0,
            residencia: '',
            fotoDni: '',
            fotoCredencial: '',
            createdAt: evt.data.createdAt || new Date().toISOString(),
            bio: ''
        })
    }
}
