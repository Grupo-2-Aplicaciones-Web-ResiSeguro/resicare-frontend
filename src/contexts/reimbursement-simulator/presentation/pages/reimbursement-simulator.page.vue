<template>
  <div class="simulator-page">
    <header class="page-header">
      <button class="btn-back" type="button" @click="goBack">
        ← {{ t('common.back') }}
      </button>
      <h1>{{ t('simulator.title') }}</h1>
    </header>

    <div class="simulator-content">
      <PlanSelector
        v-model="formData.planElegido"
        @change="showPlanDialog = true"
      />

      <CoverageDurationSelector
        v-model="formData.duracionCobertura"
      />

      <PaymentFrequencySelector
        v-model="formData.frecuenciaPago"
      />

      <InsuredObjectsInput
        v-model="formData.objetosAsegurados"
        :registeredObjects="registeredObjects"
      />

      <div class="action-buttons">
        <pv-button
          :label="t('simulator.calculateInsurance')"
          class="btn-calculate"
          @click="calculateInsurance"
        />
      </div>
    </div>

    <pv-dialog
      v-model:visible="showPlanDialog"
      :header="t('simulator.selectPlan')"
      :modal="true"
      :style="{ width: '90%', maxWidth: '500px' }"
    >
      <div class="plan-options">
        <button
          v-for="plan in availablePlans"
          :key="plan.id"
          class="plan-option"
          @click="selectPlan(plan)"
        >
          {{ plan.nombre }}
        </button>
      </div>
    </pv-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import PlanSelector from '../components/plan-selector.component.vue'
import CoverageDurationSelector from '../components/coverage-duration-selector.component.vue'
import PaymentFrequencySelector from '../components/payment-frequency-selector.component.vue'
import InsuredObjectsInput from '../components/insured-objects-input.component.vue'
import { ReimbursementSimulatorApiService } from '@/contexts/reimbursement-simulator/infraestructure/reimbursement-simulator-api.service.js'
import { http } from '@/shared-kernel/infrastructure/http/http.js'

const { t } = useI18n()
const router = useRouter()
const simulatorApi = new ReimbursementSimulatorApiService()

const formData = reactive({
  planElegido: '',
  duracionCobertura: '',
  frecuenciaPago: 'monthly',
  objetosAsegurados: '',
  montoTotal: 0,
  descuento: 0,
  montoFinal: 0
})

const showPlanDialog = ref(false)
const availablePlans = ref([
  { id: 1, nombre: 'Plan Básico' },
  { id: 2, nombre: 'Plan Premium' }
])
const registeredObjects = ref([])

onMounted(async () => {
  // Obtener objetos registrados desde la API
  try {
    const response = await http.get('/registeredObjects')
    if (response.status === 200 && Array.isArray(response.data)) {
      registeredObjects.value = response.data.map(obj => obj.nombre)
    }
  } catch (e) {
    registeredObjects.value = []
  }
})

function selectPlan(plan) {
  formData.planElegido = plan.nombre
  showPlanDialog.value = false
}

async function calculateInsurance() {
  if (!formData.planElegido || !formData.duracionCobertura) {
    alert(t('simulator.pleaseCompleteForm'))
    return
  }

  try {
    const baseAmount = 100
    formData.montoTotal = baseAmount
    formData.descuento = formData.frecuenciaPago === 'annual' ? baseAmount * 0.1 : 0
    formData.montoFinal = formData.montoTotal - formData.descuento

    const response = await simulatorApi.create(formData)
    if (response.status === 201) {
      alert(t('simulator.calculationSuccess'))
      router.push({ name: 'home' })
    }
  } catch (error) {
    console.error('Error al calcular seguro:', error)
    alert(t('simulator.calculationError'))
  }
}

function goBack() {
  router.back()
}
</script>

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

.plan-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.plan-option {
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: white;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}

.plan-option:hover {
  background: var(--color-background-soft);
  border-color: var(--vt-c-indigo);
}
</style>
