<!-- teleconsultation-list.component.vue -->
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

defineProps<{
  scheduled: Array<any>,
  loading: boolean,
  error: string | null,
  formatService: (key: string) => string,
  formatDateTime: (date: string, time: string) => string
}>()

const emit = defineEmits<{
  delete: [id: number]
}>()

/**
 * Handles teleconsultation deletion with user confirmation.
 * @param {Object} consultation - Consultation to delete
 */
function handleDelete(consultation: any) {
  if (confirm('¿Estás seguro de que deseas cancelar esta teleconsulta?')) {
    emit('delete', consultation.id)
  }
}
</script>

<template>
  <section
      aria-label="Scheduled teleconsultations"
      role="region"
  >
    <h2 class="sr-only">Your scheduled appointments</h2>

    <div
        v-if="loading"
        class="status"
        role="status"
        aria-live="polite"
    >
      Cargando consultas agendadas...
    </div>

    <div
        v-else-if="error"
        class="status error"
        role="alert"
        aria-live="assertive"
    >
      Error: {{ error }}
    </div>

    <div v-else>
      <div v-if="scheduled.length">
        <ul
            class="consultation-list"
            role="list"
            aria-label="List of scheduled teleconsultations"
        >
          <li
              v-for="c in scheduled"
              :key="c.id"
              class="consultation-item"
              role="listitem"
          >
            <div class="left">
              <div class="service" aria-label="Service type">
                {{ formatService(c.service) }}
              </div>
              <div class="datetime" aria-label="Appointment date and time">
                {{ formatDateTime(c.date, c.time) }}
              </div>
            </div>
            <div class="middle">
              <p class="description" aria-label="Consultation description">
                {{ c.description || '-' }}
              </p>
            </div>
            <div class="right">
              <button
                  class="delete-btn"
                  type="button"
                  @click="handleDelete(c)"
                  :aria-label="`Cancel ${formatService(c.service)} appointment on ${formatDateTime(c.date, c.time)}`"
              >
                <svg
                    class="icon"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                    focusable="false"
                >
                  <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div
          v-else
          class="no-items"
          role="status"
      >
        No hay consultas agendadas.
      </div>
    </div>
  </section>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.status {
  text-align: center;
  color: #6b7280;
  margin: 1rem 0;
}
.status.error {
  color: #c53030;
}
.consultation-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.consultation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: var(--card-bg, #fff);
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.consultation-item .left {
  display: flex;
  flex-direction: column;
  min-width: 140px;
}
.service {
  font-weight: 600;
  color: var(--color-heading, #111827);
}
.datetime {
  color: #6b7280;
  font-size: 0.95rem;
}
.middle {
  flex: 1;
}
.description {
  color: #374151;
  margin: 0;
  max-width: 420px;
  word-break: break-word;
}
.right {
  display: flex;
  align-items: center;
}
.delete-btn {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  padding: 6px;
}
.delete-btn:hover {
  background: #dc2626;
  transform: scale(1.05);
}
.delete-btn:active {
  background: #b91c1c;
  transform: scale(0.95);
}
.delete-btn:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
.icon {
  width: 20px;
  height: 20px;
}
.no-items {
  text-align: center;
  color: #6b7280;
  padding: 1rem 0;
}

@media (max-width: 600px) {
  .consultation-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .consultation-item .left {
    width: 100%;
  }

  .middle {
    width: 100%;
  }

  .right {
    width: 100%;
    justify-content: flex-end;
  }

  .description {
    text-align: left;
    max-width: 100%;
  }
}
</style>