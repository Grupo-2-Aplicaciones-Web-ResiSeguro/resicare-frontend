<template>
  <div class="form-group">
    <label for="registered-object">{{ $t('claims.registeredObject') }}</label>
    <div class="object-buttons">
      <pv-button
        v-for="obj in registeredObjects"
        :key="obj.value"
        :label="obj.label"
        :class="['object-button', { 'p-button-outlined': localValue !== obj.value }]"
        :severity="localValue === obj.value ? 'primary' : 'secondary'"
        @click="selectObject(obj.value)"
      />
      <pv-button
        :label="$t('claims.registerObject')"
        icon="pi pi-plus"
        class="object-button"
        severity="info"
        outlined
        @click="showRegisterDialog"
      />
    </div>
    <p class="help-text">{{ $t('claims.selectPreviouslyRegistered') }}</p>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { RegisteredObjectApiService } from '@/contexts/registered-objects/infraestructure/registered-object-api.service.js'
import { RegisteredObjectAssembler } from '@/contexts/registered-objects/Domain/registered-object.assembler.js'

const router = useRouter()
const api = new RegisteredObjectApiService()

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'register-object'])

const objectsList = ref([])

const localValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const registeredObjects = computed(() => {
  return objectsList.value.map(obj => ({
    label: obj.nombre,
    value: obj.id
  }))
})

onMounted(async () => {
  try {
    const response = await api.getAll()
    objectsList.value = RegisteredObjectAssembler.toEntitiesFromResponse(response)
  } catch (error) {
    console.error('Error al cargar objetos registrados:', error)
  }
})

const selectObject = (value) => {
  localValue.value = value
}

const showRegisterDialog = () => {
  router.push({ name: 'register-object' })
}
</script>

<style scoped>
.form-group {
  margin-bottom: 1.5rem;
}

.object-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.object-button {
  flex: 1;
  min-width: 120px;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.help-text {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}
</style>
