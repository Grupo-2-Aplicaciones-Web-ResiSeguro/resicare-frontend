import { User } from './user.entity.js'

export class UserAssembler {
    static fromAuthResponse(data = {}) {
        const id = data.id || data.userId || data.sub || ''
        const name = data.name || data.nombre || `${data.firstName || ''} ${data.lastName || ''}`.trim()
        return new User({
            id,
            email: data.email || '',
            name,
            // Si el backend no devuelve rol, asumimos 'cliente' por registros desde frontend
            rol: data.rol || data.role || 'cliente',
            createdAt: data.createdAt || null
        })
    }
}
