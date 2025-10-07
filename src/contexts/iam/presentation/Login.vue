<template>
  <form @submit.prevent="onSubmit">
    <input v-model="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <button type="submit">Iniciar sesión</button>
    <button @click.prevent="goRegister">¿No tienes cuenta? Registrarse</button>
    <p v-if="error">{{ error }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService } from '../application/auth.service.js'
import { TokenService } from '../infraestructure/token.service.js'

const router = useRouter()
const auth = new AuthService()

const email = ref('')
const password = ref('')
const error = ref('')

async function onSubmit() {
  error.value = ''
  try {
    const res = await auth.login({ email: email.value, password: password.value })
    if (res.status === 200 && res.token) {
      TokenService.save(res.token)
      localStorage.setItem('currentUser', JSON.stringify(res.user))
      router.push('/home')
    } else {
      error.value = 'Credenciales inválidas'
    }
  } catch (e) {
    error.value = 'Error de conexión'
  }
}

function goRegister() {
  router.push('/register')
}
</script>
