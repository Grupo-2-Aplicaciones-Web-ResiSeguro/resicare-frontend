import { http } from '@/shared-kernel/infrastructure/http/http.js'

export class AuthApiService {
    async signin({ email, password }) {
        return await http.get('/api/users', { params: { email: email.trim(), password: password.trim() } })
    }

    async signup(payload) {
        return await http.post('/api/users', payload)
    }

    async me(userId) {
        return await http.get(`/api/users/${userId}`)
    }
}
