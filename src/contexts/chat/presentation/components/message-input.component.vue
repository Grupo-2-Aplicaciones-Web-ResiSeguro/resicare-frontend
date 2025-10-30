<template>
  <div class="message-input">
    <div class="input-container">
      <pv-input-text
        v-model="messageText"
        :placeholder="t('chat.typePlaceholder')"
        class="message-field"
        @keypress.enter="handleSend"
        :disabled="disabled"
      />
      <pv-button
        :label="t('chat.send')"
        icon="pi pi-send"
        @click="handleSend"
        :disabled="!canSend"
        class="send-button"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['send-message'])

const messageText = ref('')

const canSend = computed(() => {
  return messageText.value.trim().length > 0 && !props.disabled
})

function handleSend() {
  if (!canSend.value) return

  const message = messageText.value.trim()
  emit('send-message', message)
  messageText.value = ''
}

defineExpose({
  clear: () => { messageText.value = '' }
})
</script>

<style scoped>
.message-input {
  padding: 1rem;
  background: white;
  border-top: 1px solid var(--color-border, #e5e7eb);
}

.input-container {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.message-field {
  flex: 1;
}

.send-button {
  flex-shrink: 0;
  background: var(--vt-c-indigo, #2c3e50);
  border-color: var(--vt-c-indigo, #2c3e50);
}

.send-button:hover {
  background: #1e2b37;
  border-color: #1e2b37;
}

@media (max-width: 768px) {
  .message-input {
    padding: 0.75rem;
  }

  .send-button :deep(.p-button-label) {
    display: none;
  }
}
</style>
