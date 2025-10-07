<template>
  <section class="home-page" role="main" aria-label="Home">
    <section class="profile-section" role="region" aria-label="Perfil">
      <div class="profile-left">
        <div class="avatar" v-if="user.avatar">
          <img :src="user.avatar" :alt="`${user.name} avatar`" />
        </div>
        <div class="avatar placeholder" v-else>
          <span>{{ initials }}</span>
        </div>

        <div class="profile-text">
          <h2 class="name">{{ user.name }}</h2>
          <p class="subtitle">{{ userSubtitle }}</p>
        </div>
      </div>

      <div class="profile-actions">
        <pv-button class="btn-ghost" :label="t('home.viewProfile') || 'Ver perfil'" icon="pi pi-user" />
      </div>
    </section>

    <div class="action-buttons" role="toolbar" aria-label="Acciones principales">
      <pv-button class="btn-outline" :label="t('home.myClaims') || 'Mis reclamos'" icon="pi pi-list" @click="() => router.push({ path: '/claims' })" />
      <pv-button class="btn-outline" :label="t('home.plans') || 'Planes'" icon="pi pi-briefcase" />
      <pv-button class="btn-primary" :label="t('home.newClaim') || 'Nuevo Reclamo'" icon="pi pi-plus" @click="goToNewClaim" />
    </div>

    <div class="icon-grid" role="group" aria-label="Accesos rápidos">
      <button class="icon-card" type="button" @click="onAction('history')">
        <div class="icon-wrap"><ClockIcon aria-hidden="true" /></div>
        <div class="icon-label">{{ t('home.history') || 'Historial de Reclamos' }}</div>
      </button>

      <button class="icon-card" type="button" @click="onAction('reminders')">
        <div class="icon-wrap"><BellIcon aria-hidden="true" /></div>
        <div class="icon-label">{{ t('home.reminders') || 'Prevenciones y Recordatorios' }}</div>
      </button>

      <button class="icon-card" type="button" @click="onAction('simulator')">
        <div class="icon-wrap"><PencilIcon aria-hidden="true" /></div>
        <div class="icon-label">{{ t('home.simulator') || 'Simulador de Reembolso' }}</div>
      </button>

      <button class="icon-card" type="button" @click="onAction('teleconsult')">
        <div class="icon-wrap"><StethoscopeIcon aria-hidden="true" /></div>
        <div class="icon-label">{{ t('home.teleconsult') || 'Teleconsulta' }}</div>
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, h, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ProfileApiService } from '@/contexts/profiles/infraestructure/profile-api.service.js'

const { t } = useI18n()
const router = useRouter()
const profileApi = new ProfileApiService()

const user = reactive({
  id: '',
  name: '',
  avatar: '',
  plan: '',
})

function getCurrentUserId() {
  // El token guardado es el id del usuario autenticado
  return localStorage.getItem('accessToken_v1')
}

onMounted(async () => {
  try {
    let userId = getCurrentUserId()
    const response = await profileApi.getAll()
    const profiles = response.data

    // Si hay userId, busca el perfil correspondiente
    let profile = null
    if (userId) {
      profile = profiles.find(p => p.userId === userId)
    }
    // Si no hay userId o no se encuentra, toma el primer perfil disponible
    if (!profile && profiles.length > 0) {
      profile = profiles[0]
    }

    if (profile) {
      Object.assign(user, {
        id: profile.userId || profile.id,
        name: profile.nombre || '',
        avatar: profile.avatar || '',
        plan: profile.plan || '',
      })
    } else {
      user.name = ''
    }
  } catch (error) {
    console.error('Error al cargar el perfil:', error)
    user.name = ''
  }
})

const initials = computed(() => {
  if (!user.name) return '—'
  return user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

const userSubtitle = computed(() => {
  return t('home.welcomeBack') || '¡Bienvenido de nuevo!'
})

function onAction(key) {
  if (key === 'teleconsult') {
    router.push({ name: 'teleconsultations' })
    return
  }

  if (key === 'reminders') {
    router.push({ name: 'reminders' })
    return
  }

  if (key === 'history') {
    router.push({ path: '/claims' })
    return
  }

  if (key === 'simulator') {
    router.push({ name: 'simulator' })
    return
  }
}

function goToNewClaim() {
  router.push({ name: 'new-claim' })
}

// SVG icons
const svgAttrs = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  fill: 'none',
  role: 'img',
  focusable: 'false',
}

const ClockIcon = (props) =>
  h('svg', { ...svgAttrs, 'aria-hidden': props?.['aria-hidden'] ?? 'true', class: 'icon-svg' }, [
    h('circle', { cx: '12', cy: '12', r: '9', stroke: 'currentColor', 'stroke-width': '1.5', fill: 'none' }),
    h('path', { d: 'M12 7v5l3 2', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none' }),
  ])

const BellIcon = (props) =>
  h('svg', { ...svgAttrs, 'aria-hidden': props?.['aria-hidden'] ?? 'true', class: 'icon-svg' }, [
    h('path', {
      d: 'M15 17H9a3 3 0 0 1-3-3V11a6 6 0 1 1 12 0v3a3 3 0 0 1-3 3z',
      stroke: 'currentColor',
      'stroke-width': '1.25',
      'stroke-linejoin': 'round',
      'stroke-linecap': 'round',
      fill: 'none',
    }),
    h('path', { d: 'M12 20a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2z', stroke: 'currentColor', 'stroke-width': '1.25', fill: 'none' }),
  ])

const PencilIcon = (props) =>
  h('svg', { ...svgAttrs, 'aria-hidden': props?.['aria-hidden'] ?? 'true', class: 'icon-svg' }, [
    h('path', { d: 'M3 21l3-1 11-11 1-3-3 1L4 20z', stroke: 'currentColor', 'stroke-width': '1.25', 'stroke-linejoin': 'round', fill: 'none' }),
    h('path', { d: 'M14 7l3 3', stroke: 'currentColor', 'stroke-width': '1.25', 'stroke-linecap': 'round', fill: 'none' }),
  ])

const StethoscopeIcon = (props) =>
  h('svg', { ...svgAttrs, 'aria-hidden': props?.['aria-hidden'] ?? 'true', class: 'icon-svg' }, [
    h('path', { d: 'M20 14v2a3 3 0 1 1-6 0v-2', stroke: 'currentColor', 'stroke-width': '1.25', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none' }),
    h('path', { d: 'M14 10a4 4 0 0 0-8 0v1', stroke: 'currentColor', 'stroke-width': '1.25', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none' }),
  ])
</script>

<style scoped>
</style>
