import { AuthApiService } from '../infraestructure/auth-api.service.js'
import { ProfileApiService } from '../../profiles/infraestructure/profile-api.service.js'
import { UserAssembler } from '../domain/user.assembler.js'
import { TokenService } from '../infraestructure/token.service.js'

export class AuthService {
    constructor() {
        this.authApi = new AuthApiService()
        this.profileApi = new ProfileApiService()
    }

    async login({ email, password }) {
        const resp = await this.authApi.signin({ email, password })
        if (resp.status === 200 && Array.isArray(resp.data) && resp.data.length > 0) {
            // json-server: resp.data es un array de usuarios
            const userData = resp.data[0]
            TokenService.save(userData.id)
            const user = UserAssembler.fromAuthResponse(userData)
            let profile = null
            try {
                profile = (await this.profileApi.getByUserId(user.id)).data
            } catch (err) {
                console.warn('No se pudo obtener profile tras login (puede no existir)', err)
            }
            return { status: 200, user, profile, token: userData.id }
        }
        return { status: 401, error: 'Correo o contraseña incorrectos' }
    }

    async register(formData) {
        const signupPayload = {
            name: formData.nombre,
            email: formData.correo,
            password: formData.password,
            // Asignar rol por defecto al registrarse desde el frontend
            rol: 'cliente',
            // Guardar fecha de creación del usuario
            createdAt: new Date().toISOString()
        }
        let resp
        try {
            resp = await this.authApi.signup(signupPayload)
        } catch (err) {
            if (err?.response?.status === 404) {
                return { status: 404, error: 'El endpoint de registro no existe (404)' }
            }
            return { status: 0, error: err?.response?.data?.message || err.message || 'Error de red' }
        }
        if (!(resp.status === 200 || resp.status === 201)) {
            return { status: resp.status, error: resp.data?.message || 'Error en registro' }
        }

        const userId = resp.data.id || resp.data.userId || resp.data._id
        const profilePayload = {
            userId,
            nombre: formData.nombre,
            correo: formData.correo,
            telefono: formData.telefono || '',
            residencia: formData.residencia || '',
            edad: formData.edad || 0,
            genero: formData.genero || '',
            nivelInstruccion: formData.nivelInstruccion || '',
            // Registrar fecha de creación del profile
            createdAt: new Date().toISOString(),
        }

        try {
            const createResp = await this.profileApi.create(profilePayload)
            return { status: resp.status, auth: resp.data, profile: createResp.data }
        } catch (err) {
            console.error('No se pudo crear Profile tras signup', err)
            return { status: resp.status, auth: resp.data, profileError: err, error: err?.response?.data?.message || err.message }
        }
    }

    logout() {
        TokenService.clear()
    }
}
