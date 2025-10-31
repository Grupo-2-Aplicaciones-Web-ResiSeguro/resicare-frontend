export class User {
    constructor({
                    id = '',
                    email = '',
                    name = '',
                    rol = '',
                    createdAt = null,
                    password = ''
                } = {}) {
        this.id = id
        this.email = email
        this.name = name
        this.password = password
        this.rol = rol
        this.createdAt = createdAt
    }
}
