<template>
  <div class="profile-container">
    <div class="profile-card">
      <h1 class="app-title">{{ t('iam.common.appName') }}</h1>
      <h2 class="subtitle">{{ t('iam.profile.welcome') }}</h2>
      <div v-if="!isAuthenticated">
        <pv-button :label="t('iam.login.submit')" class="w-full mb-2" @click="goLogin" />
        <pv-button :label="t('iam.register.submit')" class="w-full p-button-outlined" @click="goRegister" />
      </div>
      <div v-else>
        <div v-if="loading" class="text-gray-500">{{ t('iam.profile.loading') }}</div>
        <div v-else-if="error" class="text-red-500">{{ t('iam.profile.errorWithMsg', { msg: error }) }}</div>
        <div v-else-if="profile">
          <div class="bg-white shadow rounded-lg p-4">
            <p><strong>{{ t('iam.profile.name') }}:</strong> {{ profile.nombre }}</p>
            <p><strong>{{ t('iam.profile.email') }}:</strong> {{ profile.correo }}</p>
            <p><strong>{{ t('iam.profile.age') }}:</strong> {{ profile.edad }}</p>
            <p><strong>{{ t('iam.profile.residence') }}:</strong> {{ profile.residencia }}</p>
            <p><strong>{{ t('iam.profile.phone') }}:</strong> {{ profile.telefono }}</p>
            <p><strong>{{ t('iam.profile.gender') }}:</strong> {{ profile.genero }}</p>
            <p><strong>{{ t('iam.profile.education') }}:</strong> {{ profile.nivelInstruccion }}</p>
            <div class="mt-4">
              <img v-if="profile.fotoDni" :src="profile.fotoDni" :alt="t('iam.profile.photoDniAlt')" class="w-32 h-32 object-cover mb-2 rounded border"/>
              <img v-if="profile.fotoCredencial" :src="profile.fotoCredencial" :alt="t('iam.profile.photoCredAlt')" class="w-32 h-32 object-cover rounded border"/>
            </div>
          </div>
          <pv-button :label="t('iam.profile.edit')" class="mt-4 w-full" @click="goToEdit" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ProfileApiService } from '@/contexts/profiles/infraestructure/profile-api.service.js'
import { ProfileAssembler } from '@/contexts/profiles/Domain/profile.assembler.js'
import { TokenService } from '@/contexts/iam/infraestructure/token.service.js'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const api = new ProfileApiService()
const { t } = useI18n()

const profile = ref(null)
const loading = ref(true)
const error = ref(null)
const isAuthenticated = computed(() => !!TokenService.get())

onMounted(async () => {
  if (!isAuthenticated.value) {
    loading.value = false
    return
  }
  try {
    const userId = route.params.userId
    const resp = await api.getByUserId(userId)
    if (resp.status === 200 && resp.data) {
      profile.value = ProfileAssembler.toEntityFromResource(resp.data)
    } else {
      error.value = t('iam.profile.notFound')
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
function goLogin() {
  router.push('/login')
}
function goRegister() {
  router.push('/register')
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%);
}
.profile-card {
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
  margin-bottom: 1rem;
  letter-spacing: 1px;
}
.subtitle {
  font-size: 1.2rem;
  color: #64748b;
  margin-bottom: 2rem;
}
</style>
