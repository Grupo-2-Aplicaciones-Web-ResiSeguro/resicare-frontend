<template>
  <div class="register-container">
    <div class="register-card">
      <h1 class="app-title">ResiCare</h1>
      <form @submit.prevent="onSubmit" class="register-form">
        <pv-input-text v-model="nombre" placeholder="Nombre completo" class="input" required />
        <pv-input-text v-model="correo" placeholder="Correo electrónico" class="input" required />
        <pv-input-text v-model="password" type="password" placeholder="Contraseña" class="input" required />
        <pv-input-text v-model="telefono" placeholder="Teléfono" class="input" />
        <pv-input-number v-model="edad" placeholder="Edad" class="input" :min="0" />
        <pv-input-text v-model="residencia" placeholder="Residencia" class="input" />
        <pv-dropdown v-model="genero" :options="generos" optionLabel="label" placeholder="Género" class="input" />
        <pv-input-text v-model="nivelInstruccion" placeholder="Nivel de instrucción" class="input" />
        <pv-button type="submit" label="Registrarse" class="w-full mb-2" />
        <pv-button label="¿Ya tienes cuenta? Iniciar sesión" class="w-full p-button-outlined" @click="goLogin" />
        <pv-message v-if="message" severity="info" :closable="false">{{ message }}</pv-message>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService } from '../application/auth.service.js'

const router = useRouter()
const auth = new AuthService()

const nombre = ref('')
const correo = ref('')
const password = ref('')
const telefono = ref('')
const edad = ref(null)
const residencia = ref('')
const genero = ref('')
const nivelInstruccion = ref('')
const message = ref('')

const generos = [
  { label: 'Masculino', value: 'Masculino' },
  { label: 'Femenino', value: 'Femenino' },
  { label: 'Otro', value: 'Otro' }
]

async function onSubmit() {
  const form = {
    nombre: nombre.value,
    correo: correo.value,
    password: password.value,
    telefono: telefono.value,
    edad: edad.value,
    residencia: residencia.value,
    genero: genero.value,
    nivelInstruccion: nivelInstruccion.value
  }
  try {
    const res = await auth.register(form)
    if (res && (res.status === 201 || res.status === 200)) {
      message.value = 'Registrado con éxito. Por favor inicia sesión.'
      setTimeout(() => router.push('/login'), 1200)
    } else if (res && res.status === 404) {
      message.value = 'Error: El endpoint de registro no existe (404). Contacta al administrador.'
    } else if (res && res.error) {
      message.value = `Error: ${res.error}`
    } else {
      message.value = 'Error registrando usuario'
    }
  } catch (err) {
    message.value = `Error de conexión: ${err?.message || err}`
  }
}

function goLogin() {
  router.push('/login')
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%);
}
.register-card {
  background: #fff;
  padding: 2.5rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.app-title {
  font-size: 2rem;
  font-weight: bold;
  color: #2563eb;
  margin-bottom: 2rem;
  letter-spacing: 1px;
}
.register-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.input {
  width: 100%;
}
</style>
