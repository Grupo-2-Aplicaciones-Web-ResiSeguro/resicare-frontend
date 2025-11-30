<script setup>
// English comment: reimbursement simulator page - calculates insurance based on registered object price
import { reactive, ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import PlanSelector from '../components/plan-selector.component.vue'
import OptionSelector from '../components/option-selector.component.vue'
import InsuredObjectsInput from '../components/insured-objects-input.component.vue'
import { RegisteredObjectApiService } from '@/contexts/registered-objects/infraestructure/registered-object-api.service.js'
import { RegisteredObjectAssembler } from '@/contexts/registered-objects/Domain/registered-object.assembler.js'

const { t } = useI18n()
const router = useRouter()
const registeredObjectApi = new RegisteredObjectApiService()

const formData = reactive({
  planElegido: '',
  duracion: '',
  frecuenciaPago: 'variante_1', // Default to monthly
  objetoSeleccionadoId: ''
})

const registeredObjects = ref([])
const loadingObjects = ref(true)
const calculationResult = ref(null)

// Percentages for each plan based on object price
const planPercentages = {
  'basico': 0.05,    // 5% of object price
  'premium': 0.08    // 8% of object price
}

// Duration multipliers
const durationMultipliers = {
  'opcion_a': 1,      // 1 month = 1x
  'opcion_b': 5.4,    // 6 months = 5.4x (10% discount vs 6 months)
  'opcion_c': 10,     // 1 year = 10x (17% discount vs 12 months)
  'opcion_d': 36      // Full career (3 years) = 36x (25% discount vs 36 months)
}

// Payment frequency modifiers (additional discount)
const paymentModifiers = {
  'variante_1': 0,      // Monthly = no additional discount
  'variante_2': 0.10    // Annual = 10% additional discount
}

const isFormValid = computed(() => {
  return formData.planElegido &&
      formData.duracion &&
      formData.frecuenciaPago &&
      formData.objetoSeleccionadoId
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
    return String(token)
  } catch {
    return null
  }
}

onMounted(async () => {
  loadingObjects.value = true
  try {
    const userId = getCurrentUserId()
    if (!userId) {
      console.warn('No user ID found')
      registeredObjects.value = []
      loadingObjects.value = false
      return
    }

    console.log('Fetching objects for user:', userId)

    const response = await registeredObjectApi.getByUserId(userId)

    console.log('API Response:', response)

    if (response && (response.status === 200 || response.data)) {
      const data = response.data ?? response
      let objects = Array.isArray(data) ? data : [data]

      // Filter and map to entity objects with full data
      objects = objects.filter(obj => obj && obj.nombre)

      registeredObjects.value = objects.map(obj =>
          RegisteredObjectAssembler.toEntityFromResource(obj)
      )

      console.log('Loaded registered objects:', registeredObjects.value)
    } else {
      console.warn('Unexpected response structure:', response)
      registeredObjects.value = []
    }
  } catch (e) {
    console.error('Error loading registered objects:', e)
    registeredObjects.value = []
  } finally {
    loadingObjects.value = false
  }
})

/**
 * Calculate insurance cost based on:
 * 1. Object price (base)
 * 2. Plan percentage (basico: 5%, premium: 8%)
 * 3. Duration multiplier
 * 4. Payment frequency discount
 */
function calculateInsurance() {
  if (!isFormValid.value) {
    alert(t('simulator.pleaseCompleteForm'))
    return
  }

  // Find selected object by ID
  const selectedObject = registeredObjects.value.find(
      obj => String(obj.id) === String(formData.objetoSeleccionadoId)
  )

  console.log('Form data:', formData)
  console.log('All objects:', registeredObjects.value)
  console.log('Selected object:', selectedObject)

  if (!selectedObject) {
    alert(t('simulator.objectNotFound'))
    return
  }

  if (!selectedObject.precio || selectedObject.precio <= 0) {
    alert(t('simulator.objectPriceRequired'))
    return
  }

  const objectPrice = Number(selectedObject.precio)
  const planPercentage = planPercentages[formData.planElegido]
  const durationMultiplier = durationMultipliers[formData.duracion]
  const paymentModifier = paymentModifiers[formData.frecuenciaPago]

  // Calculate monthly base insurance
  const monthlyInsurance = objectPrice * planPercentage

  // Apply duration multiplier
  const totalBeforeDiscount = monthlyInsurance * durationMultiplier

  // Apply payment frequency discount
  const discountAmount = totalBeforeDiscount * paymentModifier
  const finalAmount = totalBeforeDiscount - discountAmount

  calculationResult.value = {
    objectName: selectedObject.nombre,
    objectPrice: objectPrice,
    monthlyInsurance: monthlyInsurance,
    montoTotal: totalBeforeDiscount,
    descuento: discountAmount,
    montoFinal: finalAmount,
    planPercentage: planPercentage * 100,
    durationMonths: getDurationInMonths(formData.duracion)
  }

  console.log('Calculation result:', calculationResult.value)
}

function getDurationInMonths(duracion) {
  const months = {
    'opcion_a': 1,
    'opcion_b': 6,
    'opcion_c': 12,
    'opcion_d': 36
  }
  return months[duracion] || 0
}

function goBack() {
  router.back()
}
</script>

<template>
  <div class="simulator-page">
    <header class="page-header">
      <button
          class="btn-back"
          type="button"
          aria-label="Go back to previous page"
          @click="goBack"
      >
        ← {{ t('common.back') }}
      </button>
      <h1 id="page-title">{{ t('simulator.title') }}</h1>
    </header>

    <form
        class="simulator-content"
        @submit.prevent="calculateInsurance"
        aria-labelledby="page-title"
    >
      <InsuredObjectsInput
          v-model="formData.objetoSeleccionadoId"
          :registeredObjects="registeredObjects"
          :loading="loadingObjects"
      />

      <PlanSelector v-model="formData.planElegido" />

      <OptionSelector
          v-model="formData.duracion"
          :legend="t('simulator.durationLegend')"
          :options="[
            { value: 'opcion_a', label: t('simulator.duration_a') },
            { value: 'opcion_b', label: t('simulator.duration_b') },
            { value: 'opcion_c', label: t('simulator.duration_c') },
            { value: 'opcion_d', label: t('simulator.duration_d') }
          ]"
      />

      <OptionSelector
          v-model="formData.frecuenciaPago"
          :legend="t('simulator.paymentFrequencyLegend')"
          :options="[
            { value: 'variante_1', label: t('simulator.payment_variant1') },
            { value: 'variante_2', label: t('simulator.payment_variant2') }
          ]"
          radioStyle
      />

      <div class="action-buttons">
        <pv-button
            type="submit"
            :label="t('simulator.calculateInsurance')"
            class="btn-calculate"
            :disabled="!isFormValid"
            :aria-disabled="!isFormValid ? 'true' : 'false'"
            aria-label="Calculate insurance cost"
        />
      </div>

      <div
          v-if="calculationResult"
          class="result-card"
          role="region"
          aria-live="polite"
          aria-label="Calculation result"
      >
        <h2>{{ t('simulator.resultTitle') }}</h2>

        <div class="result-section">
          <h3>{{ t('simulator.objectDetails') }}</h3>
          <div class="result-row">
            <span>{{ t('simulator.selectedObject') }}:</span>
            <strong>{{ calculationResult.objectName }}</strong>
          </div>
          <div class="result-row">
            <span>{{ t('simulator.objectValue') }}:</span>
            <strong>${{ calculationResult.objectPrice.toFixed(2) }}</strong>
          </div>
        </div>

        <div class="result-section">
          <h3>{{ t('simulator.insuranceCalculation') }}</h3>
          <div class="result-row">
            <span>{{ t('simulator.monthlyRate') }} ({{ calculationResult.planPercentage }}%):</span>
            <strong>${{ calculationResult.monthlyInsurance.toFixed(2) }}</strong>
          </div>
          <div class="result-row">
            <span>{{ t('simulator.duration') }} ({{ calculationResult.durationMonths }} {{ t('simulator.months') }}):</span>
            <strong>${{ calculationResult.montoTotal.toFixed(2) }}</strong>
          </div>
          <div class="result-row" v-if="calculationResult.descuento > 0">
            <span>{{ t('simulator.discount') }}:</span>
            <strong class="discount">-${{ calculationResult.descuento.toFixed(2) }}</strong>
          </div>
        </div>

        <div class="result-row total">
          <span>{{ t('simulator.finalAmount') }}:</span>
          <strong>${{ calculationResult.montoFinal.toFixed(2) }}</strong>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.simulator-page {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.btn-back {
  background: none;
  border: none;
  color: var(--vt-c-indigo, #646cff);
  font-size: 1rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.btn-back:hover {
  text-decoration: underline;
}

.btn-back:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-heading);
}

.simulator-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-calculate {
  width: 100%;
  background: var(--vt-c-indigo);
  color: white;
  padding: 1rem;
  font-weight: 600;
  border: none;
}

.btn-calculate:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.result-card {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1rem;
}

.result-card h2 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
  text-align: center;
}

.result-section {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.result-section:last-of-type {
  border-bottom: none;
}

.result-section h3 {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.result-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 0.95rem;
}

.result-row.total {
  border-top: 2px solid #cbd5e1;
  margin-top: 0.5rem;
  padding-top: 1rem;
  font-size: 1.2rem;
}

.result-row strong {
  color: var(--vt-c-indigo);
}

.result-row .discount {
  color: #16a34a;
}
</style>