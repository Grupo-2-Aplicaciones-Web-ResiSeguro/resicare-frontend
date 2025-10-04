<template>
  <section class="teleconsultations-page">
    <header class="page-header">
      <h1>{{ t('teleconsultations.title') }}</h1>
      <button class="back-btn" type="button" @click="goBack">
        ← {{ t('common.back')}}
      </button>
    </header>

    <div class="form-group">
      <service-selector v-model="consultation.service" />
    </div>
    <div class="form-group">
      <date-selector v-model="consultation.date" />
    </div>
    <div class="form-group">
      <time-selector v-model="consultation.time" />
    </div>
    <div class="form-group">
      <description-input v-model="consultation.description" />
    </div>
    <submit-button :consultation="consultation" @submit="onSubmit" />
  </section>
</template>

<script setup>
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import ServiceSelector from '../components/service-selector.component.vue'
import DateSelector from '../components/date-selector.component.vue'
import TimeSelector from '../components/time-selector.component.vue'
import DescriptionInput from '../components/description-input.component.vue'
import SubmitButton from '../components/submit-button.component.vue'
import { TeleconsultationApiService } from '../../infraestructure/teleconsultation-api.service.js'

const { t } = useI18n()
const router = useRouter()
const api = new TeleconsultationApiService()

const consultation = reactive({
  service: '',
  date: '',
  time: '',
  description: ''
})

async function onSubmit(consultationData) {
  try {
    await api.create(consultationData)
    consultation.service = ''
    consultation.date = ''
    consultation.time = ''
    consultation.description = ''
    alert('Consulta enviada correctamente')
  } catch (error) {
    alert('Error al enviar la consulta')
    console.error('Error al enviar la consulta:', error)
  }
}

function goBack() {
  router.back()
}
</script>

<style scoped>
.teleconsultations-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.form-control {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.page-header {
  text-align: center;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.page-header h1 {
  font-size: 1.5rem;
  color: var(--color-heading);
}

.back-btn {
  align-self: flex-start;
  background: none;
  border: none;
  color: var(--vt-c-indigo);
  font-size: 1rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  margin-top: 0.25rem;
}

.back-btn:hover {
  text-decoration: underline;
}
</style>
