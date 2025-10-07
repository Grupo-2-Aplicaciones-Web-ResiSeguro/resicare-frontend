<template>
  <section class="new-claim-page">
    <header class="page-header">
      <button class="back-btn" type="button" @click="goBack">
        ← {{ $t('common.back') }}
      </button>
      <h1>{{ $t('claims.newClaim') }}</h1>
    </header>

    <div class="form-container">
      <claim-type-selector v-model="claim.tipo" />

      <incident-date-picker v-model="claim.fechaIncidente" />

      <brief-description-input v-model="claim.descripcionBreve" />

      <registered-object-selector
        v-model="claim.objetoRegistrado"
      />

      <file-upload v-model="claim.fotosDocumentos" />

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
  tipo: '',
  fechaIncidente: '',
  descripcionBreve: '',
  objetoRegistrado: '',
  fotosDocumentos: []
})

const isFormValid = computed(() => {
  return claim.tipo &&
         claim.fechaIncidente &&
         claim.descripcionBreve &&
         claim.objetoRegistrado
})

async function onSubmit() {
  if (!isFormValid.value) {
    alert(t('claims.pleaseCompleteForm'))
    return
  }

  try {
    const filesData = await convertFilesToBase64(claim.fotosDocumentos)

    const claimData = {
      ...claim,
      fotosDocumentos: filesData
    }

    const resource = ClaimAssembler.toResourceFromEntity(claimData)
    await api.create(resource)

    alert(t('claims.claimSubmittedSuccess'))

    claim.tipo = ''
    claim.fechaIncidente = ''
    claim.descripcionBreve = ''
    claim.objetoRegistrado = ''
    claim.fotosDocumentos = []

    router.push('/')
  } catch (error) {
    alert(t('claims.claimSubmitError'))
    console.error('Error al enviar el reclamo:', error)
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
  router.back()
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
