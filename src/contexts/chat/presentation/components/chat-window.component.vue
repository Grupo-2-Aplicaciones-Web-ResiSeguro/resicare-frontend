<template>
  <div class="chat-window">
    <div class="chat-header">
      <div class="header-left">
        <pv-button
          v-if="showBackButton"
          icon="pi pi-arrow-left"
          text
          rounded
          @click="$emit('close')"
          class="back-button"
        />
        <div class="header-info">
          <h3 class="conversation-title">{{ title }}</h3>
          <p v-if="subtitle" class="conversation-subtitle">{{ subtitle }}</p>
        </div>
      </div>
      <div class="header-right">
        <span v-if="status" :class="['status-badge', `status-${status}`]">
          {{ getStatusLabel(status) }}
        </span>
        <pv-button
          v-if="showStatusActions && status === 'active'"
          icon="pi pi-times-circle"
          text
          rounded
          class="status-action-btn danger-btn"
          @click="$emit('close-conversation')"
        />

        <pv-button
          v-if="showStatusActions && status === 'closed'"
          icon="pi pi-refresh"
          text
          rounded
          class="status-action-btn success-btn"
          @click="$emit('reopen-conversation')"
        />

      </div>
    </div>

    <div v-if="status === 'closed'" class="closed-banner">
      <i class="pi pi-lock"></i>
      <span>{{ t('chat.conversationClosed') }}</span>
    </div>

    <MessageList
      :messages="messages"
      :loading="loading"
      ref="messageListRef"
    />

    <MessageInput
      :disabled="disabled || status === 'closed'"
      @send-message="handleSendMessage"
      ref="messageInputRef"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import MessageList from './message-list.component.vue'
import MessageInput from './message-input.component.vue'

const { t } = useI18n()

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  messages: {
    type: Array,
    required: true,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: null,
    validator: (value) => ['active', 'pending', 'closed', null].includes(value)
  },
  showBackButton: {
    type: Boolean,
    default: false
  },
  showStatusActions: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['send-message', 'close', 'close-conversation', 'reopen-conversation'])

const messageListRef = ref(null)
const messageInputRef = ref(null)

function handleSendMessage(message) {
  emit('send-message', message)
}

function getStatusLabel(status) {
  const statusLabels = {
    active: t('chat.status.active'),
    pending: t('chat.status.pending'),
    closed: t('chat.status.closed')
  }
  return statusLabels[status] || status
}

defineExpose({
  scrollToBottom: () => {
    messageListRef.value?.scrollToBottom()
  },
  clearInput: () => {
    messageInputRef.value?.clear()
  }
})
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-border, #e5e7eb);
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: var(--vt-c-indigo, #2c3e50);
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.back-button {
  color: white !important;
}

.header-info {
  flex: 1;
  min-width: 0;
}

.conversation-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-subtitle {
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  opacity: 0.85;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-right {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.status-active {
  background: rgba(34, 197, 94, 0.2);
  color: #86efac;
  border-color: rgba(34, 197, 94, 0.3);
}

.status-pending {
  background: rgba(251, 191, 36, 0.2);
  color: #fde047;
  border-color: rgba(251, 191, 36, 0.3);
}

.status-closed {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  border-color: rgba(239, 68, 68, 0.3);
}

.status-action-btn {
  color: white !important;
  margin-left: 0.5rem;
}

.closed-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border-bottom: 1px solid rgba(239, 68, 68, 0.2);
  font-size: 0.875rem;
  font-weight: 500;
}

.closed-banner i {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .chat-header {
    padding: 0.75rem 1rem;
  }

  .conversation-title {
    font-size: 1rem;
  }

  .conversation-subtitle {
    font-size: 0.8125rem;
  }
}

:deep(.status-action-btn.p-button.danger-btn) {
  background-color: rgba(239, 68, 68, 0.25) !important;
  border: 1px solid rgba(239, 68, 68, 0.5) !important;
  color: #fca5a5 !important;
}

:deep(.status-action-btn.p-button.danger-btn:hover) {
  background-color: rgba(239, 68, 68, 0.4) !important;
}

:deep(.status-action-btn.p-button.success-btn) {
  background-color: rgba(34, 197, 94, 0.25) !important;
  border: 1px solid rgba(34, 197, 94, 0.5) !important;
  color: #86efac !important;
}

:deep(.status-action-btn.p-button.success-btn:hover) {
  background-color: rgba(34, 197, 94, 0.4) !important;
}


</style>
