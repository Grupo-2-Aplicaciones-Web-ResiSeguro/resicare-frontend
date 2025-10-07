export class TokenService {
    static KEY = 'accessToken_v1'

    static save(token) {
        if (!token) return
        localStorage.setItem(TokenService.KEY, token)
    }

    static get() {
        return localStorage.getItem(TokenService.KEY)
    }

    static clear() {
        localStorage.removeItem(TokenService.KEY)
    }
}
