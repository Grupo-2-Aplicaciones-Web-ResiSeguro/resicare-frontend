<template>
  <section class="new-claim-page">
    <header class="page-header">
      <button class="back-btn" type="button" @click="goBack">
        ← {{ $t('common.back') }}
      </button>
      <h1>{{ $t('claims.newClaim') }}</h1>
    </header>

    <div class="form-container">
      <claim-type-selector v-model="claim.type" />

      <incident-date-picker v-model="claim.incidentDate" />

      <brief-description-input v-model="claim.description" />

      <registered-object-selector
        v-model="claim.objectRegistered"
      />

      <file-upload v-model="claim.documents" />

      <div class="action-buttons">
        <pv-button
          :label="$t('claims.submitClaim')"
          icon="pi pi-send"
          severity="primary"
          class="submit-btn"
          :disabled="!isFormValid"
          @click="onSubmit"
        />
      </div>

      <pv-message v-if="showInfoMessage" severity="info" class="info-message">
        {{ $t('claims.importantInfo') }}
      </pv-message>
    </div>
  </section>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ClaimTypeSelector from '../components/claim-type-selector.component.vue'
import IncidentDatePicker from '../components/incident-date-picker.component.vue'
import BriefDescriptionInput from '../components/brief-description-input.component.vue'
import RegisteredObjectSelector from '../components/registered-object-selector.component.vue'
import FileUpload from '../components/file-upload.component.vue'
import { ClaimApiService } from '../../infraestructure/claim-api.service.js'
import { ClaimAssembler } from '../../Domain/claim.assembler.js'

const { t } = useI18n()
const router = useRouter()
const api = new ClaimApiService()

const showInfoMessage = ref(true)

const claim = reactive({
  type: '',
  incidentDate: '',
  description: '',
  objectRegistered: '',
  documents: []
})

const isFormValid = computed(() => {
  return claim.type &&
         claim.incidentDate &&
         claim.description &&
         claim.objectRegistered
})

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

async function onSubmit() {
  if (!isFormValid.value) {
    alert(t('claims.pleaseCompleteForm'))
    return
  }

  try {
    const filesData = await convertFilesToBase64(claim.documents)

    const userId = getCurrentUserId() || '1'

    const claimData = {
      type: claim.type,
      incidentDate: claim.incidentDate,
      description: claim.description,
      objectRegistered: claim.objectRegistered,
      documents: filesData,
      userId: userId,
      status: 'pending',
      creationDate: new Date().toISOString()
    }

    const resource = ClaimAssembler.toResourceFromEntity(claimData)
    const resp = await api.create(resource)
    // opcional: si backend devuelve el recurso creado, podríamos usarlo
    // aseguramos que el reclamo quede en "My claims" (pendiente). Luego redirigimos.
    if (resp && (resp.status >= 200 && resp.status < 300)) {
      // redirigir al home (requerido)
      router.push('/home')
      // reset form
      claim.type = ''
      claim.incidentDate = ''
      claim.description = ''
      claim.objectRegistered = ''
      claim.documents = []
      return
    }

    alert(t('claims.claimSubmittedSuccess'))

    // Reset form
    claim.type = ''
    claim.incidentDate = ''
    claim.description = ''
    claim.objectRegistered = ''
    claim.documents = []

    // redirigir al home por defecto
    router.push('/home')
  } catch (error) {
    alert(t('claims.claimSubmitError'))
    console.error('Error submitting claim:', error)
  }
}

async function convertFilesToBase64(files) {
  const promises = files.map(file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        resolve({
          name: file.name,
          type: file.type,
          size: file.size,
          data: e.target.result
        })
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  })

  return await Promise.all(promises)
}

function goBack() {
  router.push('/home')
}
</script>

<style scoped>
.new-claim-page {
  max-width: 700px;
  margin: 0 auto;
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.75rem;
  margin: 0.5rem 0;
  text-align: center;
}

.back-btn {
  background: none;
  border: none;
  color: var(--vt-c-indigo, #646cff);
  font-size: 1rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  margin-bottom: 0.5rem;
}

.back-btn:hover {
  text-decoration: underline;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.action-btn,
.submit-btn {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
}

.info-message {
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .new-claim-page {
    padding: 1rem;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }
}
</style>
