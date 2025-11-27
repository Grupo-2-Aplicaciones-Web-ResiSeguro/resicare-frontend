<template>
  <article
      class="profile-view card-elevated"
      role="article"
      aria-label="User profile information"
  >
    <header class="pv-header">
      <div
          class="pv-avatar"
          :aria-label="`${profile.nombre || 'User'} avatar`"
          role="img"
      >
        {{ initials }}
      </div>

      <div class="pv-title">
        <h2 class="name">{{ profile.nombre || t('iam.profile.name') }}</h2>
        <p class="email">{{ profile.correo }}</p>

        <div class="badges" role="list" aria-label="User attributes">
          <span
              v-if="displayGenero"
              class="badge badge-muted"
              role="listitem"
          >
            {{ t('iam.profile.gender') }}: {{ displayGenero }}
          </span>
          <span
              v-if="displayEducation"
              class="badge badge-accent"
              role="listitem"
          >
            {{ t('iam.profile.education') }}: {{ displayEducation }}
          </span>
        </div>
      </div>

      <div class="pv-actions">
        <pv-button
            v-if="isOwnProfile"
            :label="t('iam.profile.edit')"
            icon="pi pi-pencil"
            class="edit-btn"
            :aria-label="`Edit ${profile.nombre || 'your'} profile`"
            @click="$emit('edit')"
        />
      </div>
    </header>

    <main class="pv-body">
      <section
          class="pv-left"
          aria-label="Personal information"
      >
        <div class="info-row">
          <div class="info-item">
            <label id="phone-label">{{ t('iam.profile.phone') }}</label>
            <div class="value" aria-labelledby="phone-label">
              {{ profile.telefono || '-' }}
            </div>
          </div>
          <div class="info-item">
            <label id="age-label">{{ t('iam.profile.age') }}</label>
            <div class="value" aria-labelledby="age-label">
              {{ profile.edad ?? '-' }}
            </div>
          </div>
        </div>

        <div class="info-block">
          <label id="residence-label">{{ t('iam.profile.residence') }}</label>
          <div class="value block" aria-labelledby="residence-label">
            {{ profile.residencia || '-' }}
          </div>
        </div>

        <div class="info-block">
          <label id="bio-label">{{ bioLabel }}</label>
          <div class="value block" aria-labelledby="bio-label">
            {{ profile.bio || '-' }}
          </div>
        </div>

        <div class="meta-row">
          <small class="muted" role="status">
            {{ createdAtLabel }} {{ formattedCreatedAt }}
          </small>
        </div>
      </section>

      <aside
          class="pv-right"
          aria-label="Profile photos"
      >
        <div class="photos">
          <figure v-if="profile.fotoDni" class="photo-card">
            <img
                :src="profile.fotoDni"
                :alt="t('iam.profile.photoDniAlt')"
            />
            <figcaption class="photo-label">
              {{ t('iam.profile.photoDniAlt') }}
            </figcaption>
          </figure>

          <figure v-if="profile.fotoCredencial" class="photo-card">
            <img
                :src="profile.fotoCredencial"
                :alt="t('iam.profile.photoCredAlt')"
            />
            <figcaption class="photo-label">
              {{ t('iam.profile.photoCredAlt') }}
            </figcaption>
          </figure>
        </div>
      </aside>
    </main>
  </article>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()
const props = defineProps({
  profile: {
    type: Object,
    required: true
  }
})

defineEmits(['edit'])


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
    return null
  } catch {
    return null
  }
}

// Only show edit button if viewing own profile
const isOwnProfile = computed(() => {
  const currentId = getCurrentUserId()
  if (!currentId) return false
  const ownerId = props.profile?.userId ?? props.profile?.id ?? ''
  return String(ownerId) === String(currentId)
})

// Generate avatar initials from name
const initials = computed(() => {
  const name = props.profile?.nombre || ''
  const parts = name.split(' ').filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0,2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
})

// Format creation date for display
const formattedCreatedAt = computed(() => {
  try {
    const raw = props.profile?.createdAt
    if (!raw) return '-'
    const d = new Date(raw)
    if (isNaN(d.getTime())) return '-'

    const pad = (n) => String(n).padStart(2, '0')
    const day = pad(d.getDate())
    const month = pad(d.getMonth() + 1)
    const year = d.getFullYear()
    const hours = pad(d.getHours())
    const minutes = pad(d.getMinutes())
    const seconds = pad(d.getSeconds())

    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`
  } catch {
    return '-'
  }
})

/**
 * Handles both object and string formats from backend
 */
const displayGenero = computed(() => {
  const g = props.profile?.genero
  if (!g) return ''
  if (typeof g === 'object') return g.label ?? g.value ?? ''
  return String(g)
})

/**
 * Normalizes education level for display
 */
const displayEducation = computed(() => {
  const e = props.profile?.nivelInstruccion
  if (!e) return ''
  if (typeof e === 'object') return e.label ?? e.value ?? ''
  return String(e)
})

/**
 * Safely retrieves translation with fallback
 */
function safeTranslation(key, fallback) {
  try {
    const v = t(key)
    if (typeof v === 'string' && v === key) return fallback || ''
    return v || fallback || ''
  } catch {
    return fallback || ''
  }
}

const bioLabel = computed(() => {
  return safeTranslation('iam.profile.bio', safeTranslation('iam.profile.placeholderBio', 'Bio'))
})

const createdAtLabel = computed(() => {
  return safeTranslation('iam.profile.createdAt', 'Creado:')
})
</script>

<style scoped>
.profile-view {
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 12px;
  padding: 18px;
  max-width: 920px;
  margin: 0 auto;
  color: #0f172a;
  box-shadow: 0 6px 18px rgba(15,23,42,0.08);
  border: 1px solid rgba(15,23,42,0.04);
}

.pv-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 14px;
  position: relative;
}

.pv-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg,#6366f1,#06b6d4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 20px;
  box-shadow: 0 4px 12px rgba(99,102,241,0.18);
}

.pv-title {
  flex: 1;
}

.name {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
}

.email {
  margin: 4px 0 0;
  color: #475569;
  font-size: 0.95rem;
}

.badges {
  margin-top: 8px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
  display: inline-block;
}

.badge-muted {
  background: #eef2ff;
  color: #0f172a;
  border: 1px solid rgba(15,23,42,0.04);
}

.badge-accent {
  background: #dcfce7;
  color: #166534;
  border: 1px solid rgba(16,185,129,0.08);
}

.pv-actions {
  position: absolute;
  right: 0;
  top: 0;
}

.pv-body {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  margin-top: 6px;
}

.pv-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  gap: 12px;
}

.info-item {
  flex: 1;
  background: #fff;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(15,23,42,0.03);
}

.info-item label {
  font-size: 0.8rem;
  color: #64748b;
  display: block;
  margin-bottom: 6px;
}

.value {
  font-weight: 600;
  color: #0f172a;
}

.info-block {
  background: #fff;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(15,23,42,0.03);
}

.info-block label {
  font-size: 0.85rem;
  color: #64748b;
  display: block;
  margin-bottom: 6px;
}

.block {
  white-space: pre-line;
  color: #0f172a;
}

.meta-row {
  display: flex;
  gap: 12px;
  color: #94a3b8;
  font-size: 0.85rem;
}

.pv-right {
  width: 220px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.photos {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.photo-card {
  background: #fff;
  border-radius: 8px;
  padding: 8px;
  border: 1px solid rgba(15,23,42,0.03);
  text-align: center;
  margin: 0;
}

.photo-card img {
  max-width: 100%;
  border-radius: 6px;
  display: block;
  margin: 0 auto;
}

.photo-label {
  display: block;
  margin-top: 6px;
  font-size: 0.8rem;
  color: #475569;
}

@media (max-width: 760px) {
  .pv-body {
    flex-direction: column;
  }

  .pv-right {
    width: 100%;
  }

  .pv-actions {
    position: static;
    margin-top: 8px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>