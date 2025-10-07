<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Perfil de Usuario</h1>

    <div v-if="loading" class="text-gray-500">Cargando perfil...</div>
    <div v-else-if="error" class="text-red-500">Error: {{ error }}</div>
    <div v-else-if="profile">
      <div class="bg-white shadow rounded-lg p-4">
        <p><strong>Nombre:</strong> {{ profile.nombre }}</p>
        <p><strong>Correo:</strong> {{ profile.correo }}</p>
        <p><strong>Edad:</strong> {{ profile.edad }}</p>
        <p><strong>Residencia:</strong> {{ profile.residencia }}</p>
        <p><strong>Teléfono:</strong> {{ profile.telefono }}</p>
        <p><strong>Género:</strong> {{ profile.genero }}</p>
        <p><strong>Nivel de instrucción:</strong> {{ profile.nivelInstruccion }}</p>

        <div class="mt-4">
          <img v-if="profile.fotoDni" :src="profile.fotoDni" alt="Foto DNI" class="w-32 h-32 object-cover mb-2 rounded border"/>
          <img v-if="profile.fotoCredencial" :src="profile.fotoCredencial" alt="Foto Credencial" class="w-32 h-32 object-cover rounded border"/>
        </div>
      </div>

      <button
          @click="goToEdit"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Editar Perfil
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ProfileApiService } from '@/contexts/profiles/infraestructure/profile-api.service.js'
import { ProfileAssembler } from '@/contexts/profiles/Domain/profile.assembler.js'

const route = useRoute()
const router = useRouter()
const api = new ProfileApiService()

const profile = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const userId = route.params.userId
    const resp = await api.getByUserId(userId) // método que agregamos en ProfileApiService
    if (resp.status === 200 && resp.data) {
      profile.value = ProfileAssembler.toEntityFromResource(resp.data)
    } else {
      error.value = 'Perfil no encontrado'
    }
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

function goToEdit() {
  router.push({ name: 'profile-edit', params: { userId: route.params.userId } })
}
</script>

<style scoped>
</style>
