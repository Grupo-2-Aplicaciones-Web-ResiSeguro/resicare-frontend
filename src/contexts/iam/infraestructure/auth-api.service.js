import { http } from '@/shared-kernel/infrastructure/http/http.js'

export class AuthApiService {
    async signin({ email, password }) {
        return await http.get('/users', { params: { email: email.trim(), password: password.trim() } })
    }

    async signup(payload) {
        return await http.post('/users', payload)
    }

    async me() {
        return await http.get('/auth/me')
    }
}
