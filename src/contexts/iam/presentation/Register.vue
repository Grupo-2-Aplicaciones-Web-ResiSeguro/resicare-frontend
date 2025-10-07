<template>
  <form @submit.prevent="onSubmit">
    <input v-model="nombre" placeholder="Nombre completo" required />
    <input v-model="correo" placeholder="Correo" required />
    <input v-model="password" type="password" placeholder="Contraseña" required />
    <input v-model="telefono" placeholder="Teléfono" />
    <input v-model.number="edad" type="number" placeholder="Edad" />
    <input v-model="residencia" placeholder="Residencia" />
    <select v-model="genero">
      <option value="">Seleccione</option>
      <option>Masculino</option>
      <option>Femenino</option>
      <option>Otro</option>
    </select>
    <input v-model="nivelInstruccion" placeholder="Nivel de instrucción" />
    <button type="submit">Registrarse</button>
    <p v-if="message">{{ message }}</p>
  </form>
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
const edad = ref(0)
const residencia = ref('')
const genero = ref('')
const nivelInstruccion = ref('')
const message = ref('')

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
      router.push('/login')
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
</script>
