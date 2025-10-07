export class User {
    constructor({
                    id = '',
                    email = '',
                    name = '',
                    rol = '',
                    createdAt = null
                } = {}) {
        this.id = id
        this.email = email
        this.name = name
        this.rol = rol
        this.createdAt = createdAt
    }
}
