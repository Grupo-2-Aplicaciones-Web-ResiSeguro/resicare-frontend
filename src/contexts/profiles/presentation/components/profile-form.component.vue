<template>
  <form class="profile-form" @submit.prevent="onSubmit">
    <pv-input-text v-model="nombre" :placeholder="t('iam.register.namePlaceholder')" required />
    <pv-input-text v-model="correo" type="email" :placeholder="t('iam.register.emailPlaceholder')" required />
    <pv-input-number v-model="edad" :placeholder="t('iam.register.agePlaceholder')" :min="0" />
    <pv-input-text v-model="residencia" :placeholder="t('iam.register.residencePlaceholder')" />
    <pv-input-text v-model="telefono" :placeholder="t('iam.register.phonePlaceholder')" />
    <pv-dropdown v-model="genero" :options="generos" optionLabel="label" optionValue="value" :placeholder="t('iam.register.genderPlaceholder')" />
    <pv-dropdown v-model="nivelInstruccion" :options="nivelOptions" optionLabel="label" optionValue="value" :placeholder="t('iam.register.educationPlaceholder')" />
    <pv-textarea v-model="bio" :placeholder="t('iam.profile.placeholderBio')" rows="4" />

    <p v-if="error" class="error">{{ error }}</p>
    <pv-button type="submit" :label="t('iam.profile.save')" class="save" />
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ProfileApiService } from '@/contexts/profiles/infraestructure/profile-api.service.js'
import { Profile } from '@/contexts/profiles/Domain/profile.entity.js'

const { t } = useI18n()
const props = defineProps({
  initialProfile: { type: Object, default: null }
})
const emit = defineEmits(['saved'])

const api = new ProfileApiService()

// helper para normalizar opción (puede venir string o {label,value})
function optToString(opt) {
  if (opt == null) return ''
  if (typeof opt === 'string') return opt
  if (typeof opt === 'object') return (opt.value ?? opt.label ?? '')
  return String(opt)
}

const nombre = ref(optToString(props.initialProfile?.nombre) || '')
const correo = ref(optToString(props.initialProfile?.correo) || '')
const edad = ref(props.initialProfile?.edad ?? null)
const residencia = ref(optToString(props.initialProfile?.residencia) || '')
const telefono = ref(optToString(props.initialProfile?.telefono) || '')
const genero = ref(optToString(props.initialProfile?.genero) || '')
const nivelInstruccion = ref(optToString(props.initialProfile?.nivelInstruccion) || '')
const bio = ref(optToString(props.initialProfile?.bio) || '')
const id = ref(props.initialProfile?.id || props.initialProfile?.userId || '')

watch(() => props.initialProfile, (nv) => {
  if (!nv) return
  nombre.value = optToString(nv.nombre) || ''
  correo.value = optToString(nv.correo) || ''
  edad.value = nv.edad ?? null
  residencia.value = optToString(nv.residencia) || ''
  telefono.value = optToString(nv.telefono) || ''
  genero.value = optToString(nv.genero) || ''
  nivelInstruccion.value = optToString(nv.nivelInstruccion) || ''
  bio.value = optToString(nv.bio) || ''
  id.value = nv.id || nv.userId || ''
})

const generos = computed(() => [
  { label: t('iam.register.gender.male'), value: 'Masculino' },
  { label: t('iam.register.gender.female'), value: 'Femenino' },
  { label: t('iam.register.gender.other'), value: 'Otro' }
])

const nivelOptions = computed(() => [
  { label: t('iam.education.universitario'), value: 'Universitario' },
  { label: t('iam.education.preUniversitario'), value: 'Preuniversitario' },
  { label: t('iam.education.postgrado'), value: 'Postgrado' }
])

const error = ref(null)

function validate() {
  if (!nombre.value || !correo.value) {
    error.value = t('iam.profile.validationRequired') || 'Completa los campos requeridos'
    return false
  }
  // mínimo: email simple
  if (!/^\S+@\S+\.\S+$/.test(correo.value)) {
    error.value = t('iam.profile.invalidEmail') || 'Email inválido'
    return false
  }
  return true
}

async function onSubmit() {
  if (!validate()) return
  error.value = null

  // construir payload con strings (no objetos)
  const payload = new Profile({
    id: id.value,
    userId: id.value || undefined,
    nombre: nombre.value,
    correo: correo.value,
    edad: edad.value,
    residencia: residencia.value,
    telefono: telefono.value,
    genero: genero.value ?? genero, // genero es string
    nivelInstruccion: nivelInstruccion.value ?? nivelInstruccion,
    fotoDni: props.initialProfile?.fotoDni || '',
    fotoCredencial: props.initialProfile?.fotoCredencial || '',
    createdAt: props.initialProfile?.createdAt || new Date().toISOString()
  })

  try {
    if (id.value) {
      await api.update(id.value, payload)
    } else {
      await api.create(payload)
    }
    emit('saved')
  } catch (e) {
    error.value = e?.message || t('iam.profile.saveError') || 'Error guardando perfil'
  }
}
</script>

<style scoped>
.profile-form { display:flex; flex-direction:column; gap:0.75rem; max-width:640px; }
.save { margin-top:0.5rem; }
.error { color: #c53030; }
</style>
