<template>
  <section class="profile-edit-page">
    <header class="page-header">
      <!-- usar mismo estilo/back-btn que reminders.page.vue y navegar a /home -->
      <pv-button icon="pi pi-arrow-left" class="back-btn" @click="$router.push('/profile')" :label="t('common.back')" />
      <h1>{{ t('iam.profile.editTitle') || 'Editar perfil' }}</h1>
    </header>

    <div v-if="loading">{{ t('iam.profile.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else class="edit-card">
      <form @submit.prevent="onSubmit" class="profile-form">
        <pv-input-text v-model="nombre" :placeholder="t('iam.register.namePlaceholder')" required />
        <small v-if="errors.nombre" class="field-error">{{ errors.nombre }}</small>

        <pv-input-text v-model="correo" type="email" :placeholder="t('iam.register.emailPlaceholder')" required />
        <small v-if="errors.correo" class="field-error">{{ errors.correo }}</small>

        <pv-input-text v-model="password" type="password" :placeholder="t('iam.profile.passwordPlaceholder')" />
        <small v-if="errors.password" class="field-error">{{ errors.password }}</small>

        <pv-input-number v-model="edad" :placeholder="t('iam.register.agePlaceholder')" :min="0" :max="120" />
        <small v-if="errors.edad" class="field-error">{{ errors.edad }}</small>

        <pv-input-text v-model="residencia" :placeholder="t('iam.register.residencePlaceholder')" />
        <small v-if="errors.residencia" class="field-error">{{ errors.residencia }}</small>

        <pv-input-text v-model="telefono" :placeholder="t('iam.register.phonePlaceholder')" />
        <small v-if="errors.telefono" class="field-error">{{ errors.telefono }}</small>

        <pv-dropdown
          v-model="genero"
          :options="generos"
          optionLabel="label"
          optionValue="value"
          :placeholder="t('iam.register.genderPlaceholder')"
        />
        <small v-if="errors.genero" class="field-error">{{ errors.genero }}</small>

        <pv-dropdown
          v-model="nivelInstruccion"
          :options="nivelOptions"
          optionLabel="label"
          optionValue="value"
          :placeholder="t('iam.register.educationPlaceholder')"
        />
        <small v-if="errors.nivelInstruccion" class="field-error">{{ errors.nivelInstruccion }}</small>

        <pv-textarea v-model="bio" :placeholder="t('iam.profile.placeholderBio')" rows="4" />

        <pv-button type="submit" :label="t('iam.profile.save')" class="save" :disabled="submitting" />
        <pv-message v-if="globalError" severity="error" :closable="false">{{ globalError }}</pv-message>
        <pv-message v-if="message" severity="info" :closable="false">{{ message }}</pv-message>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ProfileApiService } from '@/contexts/profiles/infraestructure/profile-api.service.js'
import { ProfileAssembler } from '@/contexts/profiles/Domain/profile.assembler.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const api = new ProfileApiService()

const profile = ref(null)
const loading = ref(true)
const error = ref(null)

const nombre = ref('')
const correo = ref('')
const password = ref('') // opcional: sólo si se admite cambio de contraseña
const edad = ref(null)
const residencia = ref('')
const telefono = ref('')
const genero = ref('')
const nivelInstruccion = ref('')
const bio = ref('')

const message = ref('')
const globalError = ref('')
const submitting = ref(false)

const errors = ref({
  nombre: '',
  correo: '',
  password: '',
  telefono: '',
  edad: '',
  residencia: '',
  genero: '',
  nivelInstruccion: ''
})

const generos = computed(() => [
  { label: t('iam.register.gender.male'), value: 'Masculino' },
  { label: t('iam.register.gender.female'), value: 'Femenino' },
  { label: t('iam.register.gender.other'), value: 'Otro' }
])

const nivelOptions = computed(() => [
  { label: t('iam.education.preUniversitario'), value: 'Preuniversitario' },
  { label: t('iam.education.universitario'), value: 'Universitario' },
  { label: t('iam.education.postgrado'), value: 'Postgrado' }
])

function clearErrors() {
  Object.keys(errors.value).forEach(k => errors.value[k] = '')
  globalError.value = ''
  message.value = ''
}

function validateEmail(v) {
  if (!v) return false
  const re = /^\S+@\S+\.\S+$/
  return re.test(String(v).toLowerCase())
}

function validate() {
  clearErrors()
  let ok = true
  if (!nombre.value || String(nombre.value).trim().length < 3) {
    errors.value.nombre = t('iam.register.validation.name', { default: 'El nombre debe tener al menos 3 caracteres' })
    ok = false
  }
  if (!correo.value || !validateEmail(correo.value)) {
    errors.value.correo = t('iam.register.validation.email', { default: 'Correo inválido' })
    ok = false
  }
  // password es opcional en edición, pero si se suministra debe cumplir
  if (password.value && String(password.value).length < 8) {
    errors.value.password = t('iam.register.validation.password', { default: 'La contraseña debe tener al menos 8 caracteres' })
    ok = false
  }
  if (telefono.value && !/^[0-9+()\s-]{4,20}$/.test(String(telefono.value))) {
    errors.value.telefono = t('iam.register.validation.phone', { default: 'Teléfono inválido' })
    ok = false
  }
  if (edad.value != null && (isNaN(edad.value) || edad.value < 0 || edad.value > 120)) {
    errors.value.edad = t('iam.register.validation.age', { default: 'Edad inválida' })
    ok = false
  }
  if (residencia.value && String(residencia.value).length > 120) {
    errors.value.residencia = t('iam.register.validation.residence', { default: 'Residencia demasiado larga' })
    ok = false
  }
  if (!genero.value) {
    errors.value.genero = t('iam.register.validation.gender', { default: 'Selecciona un género' })
    ok = false
  }
  if (!nivelInstruccion.value) {
    errors.value.nivelInstruccion = t('iam.register.validation.education', { default: 'Selecciona nivel de instrucción' })
    ok = false
  }
  return ok
}

function getCurrentUserId() {
  try {
    const currentUserRaw = localStorage.getItem('currentUser')
    if (currentUserRaw) {
      try {
        const parsed = JSON.parse(currentUserRaw)
        const candidate = parsed.id ?? parsed.userId ?? parsed.sub ?? parsed.uid ?? null
        if (candidate) return String(candidate)
      } catch {}
    }
    const token = localStorage.getItem('accessToken_v1') || localStorage.getItem('token')
    if (!token) return null
    if (token.split && token.split('.').length === 3) {
      try {
        const payloadB64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
        const pad = payloadB64.length % 4
        const padded = pad ? payloadB64 + '='.repeat(4 - pad) : payloadB64
        const payloadJson = decodeURIComponent(
          Array.prototype.map.call(atob(padded), c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        )
        const payload = JSON.parse(payloadJson)
        const candidate = payload.sub ?? payload.id ?? payload.userId ?? payload.uid ?? null
        if (candidate) return String(candidate)
      } catch {}
    }
    return String(token)
  } catch {
    return null
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const paramId = route.params.userId
    const userId = paramId || getCurrentUserId()
    if (!userId) {
      error.value = t('iam.profile.notFound') || 'Perfil no encontrado'
      return
    }

    let resp
    try {
      resp = typeof api.getByUserId === 'function' ? await api.getByUserId(userId) : await api.getById(userId)
    } catch (e) {
      resp = await api.getById(userId)
    }

    const data = resp?.data ?? resp
    const resource = Array.isArray(data) ? data[0] : data
    if (!resource) {
      error.value = t('iam.profile.notFound') || 'Perfil no encontrado'
      return
    }
    profile.value = ProfileAssembler.toEntityFromResource ? ProfileAssembler.toEntityFromResource(resource) : resource

    // inicializar campos del formulario (normalizar si vienen objetos)
    const optToString = (opt) => {
      if (opt == null) return ''
      if (typeof opt === 'string') return opt
      if (typeof opt === 'object') return (opt.value ?? opt.label ?? '')
      return String(opt)
    }

    nombre.value = profile.value.nombre || ''
    correo.value = profile.value.correo || ''
    edad.value = profile.value.edad ?? null
    residencia.value = profile.value.residencia || ''
    telefono.value = profile.value.telefono || ''
    genero.value = optToString(profile.value.genero) || ''
    nivelInstruccion.value = optToString(profile.value.nivelInstruccion) || ''
    bio.value = profile.value.bio || ''
  } catch (e) {
    error.value = e?.message || String(e)
  } finally {
    loading.value = false
  }
})

async function onSubmit() {
  clearErrors()
  if (!validate()) {
    globalError.value = t('iam.register.validation.fixErrors', { default: 'Corrige los errores del formulario' })
    return
  }
  submitting.value = true
  const userId = route.params.userId || getCurrentUserId()
  if (!userId) {
    globalError.value = t('iam.profile.notFound') || 'Perfil no encontrado'
    submitting.value = false
    return
  }

  const payload = {
    id: profile.value?.id ?? undefined,
    userId,
    nombre: String(nombre.value).trim(),
    correo: String(correo.value).trim(),
    edad: edad.value != null ? Number(edad.value) : null,
    residencia: residencia.value ? String(residencia.value).trim() : '',
    telefono: telefono.value ? String(telefono.value).trim() : '',
    genero: genero.value,
    nivelInstruccion: nivelInstruccion.value,
    bio: bio.value || '',
    // if password is present, include it (depends on backend support)
    ...(password.value ? { password: password.value } : {})
  }

  try {
    const resp = await api.update(userId, payload)
    if (resp && (resp.status === 200 || resp.status === 204 || resp.status === 201)) {
      message.value = t('iam.profile.saveSuccess') || 'Perfil guardado correctamente'
      setTimeout(() => {
        router.push({ path: `/profile/${userId}` })
      }, 900)
    } else {
      globalError.value = t('iam.profile.saveError') || 'Error al guardar el perfil'
    }
  } catch (e) {
    globalError.value = e?.message || t('iam.profile.saveError') || 'Error al guardar el perfil'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.profile-edit-page{ max-width:720px; margin:0 auto; padding:1rem; }
.page-header{ display:flex; gap:1rem; align-items:center; margin-bottom:1rem; }
/* estilo igual al usado en reminders.page.vue */
.back-btn {
  background: none;
  border: none;
  color: #38bdf8;
  cursor: pointer;
  font-size: 0.95rem;
  padding: 0;
}
.back-btn:hover { text-decoration: underline; }

.edit-card {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(15,23,42,0.06);
}
.profile-form { display:flex; flex-direction:column; gap:0.75rem; max-width:640px; }
.save { margin-top:0.5rem; }
.field-error { color: #c53030; font-size:0.85rem; margin-top:-0.4rem; margin-bottom:0.4rem; }
.error{ color:#c53030; }
</style>
