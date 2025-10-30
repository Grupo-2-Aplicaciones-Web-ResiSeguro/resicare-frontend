<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="app-title">{{ t('iam.common.appName') }}</h1>
      <form @submit.prevent="onSubmit" class="login-form">
        <pv-input-text v-model="email" :placeholder="t('iam.login.emailPlaceholder')" class="input" required autofocus />
        <pv-input-text v-model="password" type="password" :placeholder="t('iam.login.passwordPlaceholder')" class="input" required />
        <pv-button type="submit" :label="t('iam.login.submit')" class="w-full mb-2" />
        <pv-button :label="t('iam.login.noAccount')" class="w-full p-button-outlined" @click="goRegister" />
        <pv-message v-if="error" severity="error" :closable="false">{{ error }}</pv-message>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService } from '../application/auth.service.js'
import { TokenService } from '../infraestructure/token.service.js'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const auth = new AuthService()
const { t } = useI18n()

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

      const userRole = res.user.role || res.user.rol
      if (userRole === 'adviser' || userRole === 'asesor') {
        router.push('/adviser/dashboard')
      } else {
        router.push('/home')
      }
    } else {
      error.value = t('iam.login.invalidCredentials')
    }
  } catch (e) {
    error.value = t('iam.login.connectionError')
  }
}

function goRegister() {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%);
}
.login-card {
  background: #fff;
  padding: 2.5rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 350px;
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
.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.input {
  width: 100%;
}
</style>
