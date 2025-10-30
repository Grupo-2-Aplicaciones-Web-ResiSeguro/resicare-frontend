<template>
  <section class="adviser-dashboard-page">
    <header class="page-header">
      <h1>{{ t('chat.adviserDashboard') }}</h1>
      <button class="logout-btn" type="button" @click="handleLogout">
        <i class="pi pi-sign-out"></i>
        {{ t('home.logout') }}
      </button>
    </header>

    <div v-if="loading && conversations.length === 0" class="loading">
      {{ t('common.loading') }}...
    </div>

    <div v-else class="dashboard-layout">
      <div class="conversations-panel">
        <div class="tabs-container">
          <button
            :class="['tab', { active: activeTab === 'unassigned' }]"
            @click="activeTab = 'unassigned'"
          >
            {{ t('chat.unassignedChats') }}
            <span v-if="unassignedConversations.length > 0" class="badge">{{ unassignedConversations.length }}</span>
          </button>
          <button
            :class="['tab', { active: activeTab === 'myChats' }]"
            @click="activeTab = 'myChats'"
          >
            {{ t('chat.myChats') }}
            <span v-if="myConversations.length > 0" class="badge">{{ myConversations.length }}</span>
          </button>
        </div>

        <ConversationList
          :conversations="displayedConversations"
          :selected-conversation-id="selectedConversationId"
          :loading="loading"
          :show-refresh-button="true"
          @select-conversation="handleSelectConversation"
          @refresh="loadConversations"
        />
      </div>

      <div class="chat-panel">
        <div v-if="!selectedConversation" class="empty-chat-state">
          <i class="pi pi-comments" style="font-size: 4rem; color: #ccc"></i>
          <p>{{ t('chat.selectConversation') }}</p>
          <p class="hint">{{ activeTab === 'unassigned' ? t('chat.selectToAssign') : t('chat.selectToView') }}</p>
        </div>

        <div v-else-if="!selectedConversation.adviserId && activeTab === 'unassigned'" class="assign-prompt">
          <div class="assign-card">
            <i class="pi pi-user-plus" style="font-size: 3rem; color: var(--vt-c-indigo)"></i>
            <h3>{{ t('chat.assignToMe') }}</h3>
            <p>{{ t('chat.assignPrompt') }}</p>
            <div class="conversation-preview">
              <strong>{{ selectedConversation.clientName }}</strong>
              <p>{{ t('chat.aboutClaim') }} #{{ selectedConversation.claimId }}</p>
              <p class="last-message">{{ selectedConversation.getLastMessagePreview(60) }}</p>
            </div>
            <div class="button-group">
              <pv-button
                :label="t('chat.assignAndOpen')"
                icon="pi pi-check"
                @click="assignToMeAndOpen"
                :loading="assigning"
              />
              <pv-button
                :label="t('common.back')"
                class="p-button-outlined"
                @click="selectedConversation = null"
              />
            </div>
          </div>
        </div>

        <ChatWindow
          v-else
          :title="chatTitle"
          :subtitle="chatSubtitle"
          :messages="messages"
          :loading="messagesLoading"
          :status="selectedConversation.status"
          :show-back-button="false"
          :show-status-actions="true"
          @send-message="sendMessage"
          @close-conversation="handleCloseConversation"
          @reopen-conversation="handleReopenConversation"
          ref="chatWindowRef"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ConversationList from '../components/conversation-list.component.vue'
import ChatWindow from '../components/chat-window.component.vue'
import { MessageApiService } from '@/contexts/chat/infrastructure'
import { ConversationApiService } from '@/contexts/chat/infrastructure'
import { MessageAssembler, ConversationAssembler } from '@/contexts/chat/Domain'
import { AuthService } from '@/contexts/iam/application/auth.service.js'

const { t } = useI18n()
const router = useRouter()
const authService = new AuthService()

const messageApi = new MessageApiService()
const conversationApi = new ConversationApiService()

const conversations = ref([])
const selectedConversation = ref(null)
const selectedConversationId = computed(() => selectedConversation.value?.id || null)
const messages = ref([])
const loading = ref(true)
const messagesLoading = ref(false)
const assigning = ref(false)
const chatWindowRef = ref(null)
const activeTab = ref('unassigned')

const chatTitle = computed(() => {
  if (selectedConversation.value) {
    return `${t('chat.chatWith')} ${selectedConversation.value.clientName}`
  }
  return t('chat.conversations')
})

const chatSubtitle = computed(() => {
  if (selectedConversation.value) {
    return `${t('chat.aboutClaim')} #${selectedConversation.value.claimId}`
  }
  return ''
})

const unassignedConversations = computed(() => {
  return conversations.value.filter(conv => !conv.adviserId || conv.status === 'pending')
})

const myConversations = computed(() => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
  const currentUserId = String(currentUser.id || '2')
  return conversations.value.filter(conv => String(conv.adviserId) === currentUserId && conv.status !== 'pending')
})

const displayedConversations = computed(() => {
  return activeTab.value === 'unassigned' ? unassignedConversations.value : myConversations.value
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
    const token = localStorage.getItem('accessToken_v1')
    if (!token) return null
    if (token.split('.').length === 3) {
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

async function loadConversations() {
  try {
    loading.value = true
    const response = await conversationApi.getAll()
    conversations.value = ConversationAssembler.toEntitiesFromResponse(response)
  } catch (error) {
    console.error('Error loading conversations:', error)
    conversations.value = []
  } finally {
    loading.value = false
  }
}

async function handleSelectConversation(conversation) {
  try {
    selectedConversation.value = conversation

    if (!conversation.adviserId && activeTab.value === 'unassigned') {
      return
    }

    messagesLoading.value = true

    const response = await messageApi.getByConversationId(conversation.id)
    messages.value = MessageAssembler.toEntitiesFromResponse(response)

    const unreadMessages = messages.value.filter(m => !m.isRead && m.isFromClient())
    if (unreadMessages.length > 0) {
      const unreadIds = unreadMessages.map(m => m.id)
      await messageApi.markMultipleAsRead(unreadIds)

      await conversationApi.resetUnreadCount(conversation.id)

      conversation.unreadCount = 0
    }

    messagesLoading.value = false

    setTimeout(() => {
      chatWindowRef.value?.scrollToBottom()
    }, 100)
  } catch (error) {
    console.error('Error selecting conversation:', error)
    messagesLoading.value = false
  }
}

async function assignToMeAndOpen() {
  try {
    if (!selectedConversation.value) return

    assigning.value = true
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')

    await conversationApi.assignAdviser(
      selectedConversation.value.id,
      currentUser.id || '2',
      currentUser.nombre || 'Asesor'
    )

    selectedConversation.value.adviserId = currentUser.id || '2'
    selectedConversation.value.adviserName = currentUser.nombre || 'Asesor'
    selectedConversation.value.status = 'active'

    await loadConversations()

    activeTab.value = 'myChats'

    messagesLoading.value = true
    const response = await messageApi.getByConversationId(selectedConversation.value.id)
    messages.value = MessageAssembler.toEntitiesFromResponse(response)
    messagesLoading.value = false

    setTimeout(() => {
      chatWindowRef.value?.scrollToBottom()
    }, 100)

    assigning.value = false
  } catch (error) {
    console.error('Error assigning conversation:', error)
    assigning.value = false
  }
}

async function sendMessage(messageContent) {
  try {
    if (!selectedConversation.value) return

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')

    const newMessageData = MessageAssembler.createNewMessage({
      conversationId: selectedConversation.value.id,
      senderId: currentUser.id || '2',
      senderName: currentUser.nombre || 'Asesor',
      senderRole: 'adviser',
      content: messageContent
    })

    const response = await messageApi.create(newMessageData)
    const newMessage = MessageAssembler.toEntity(response.data)

    messages.value.push(newMessage)

    await conversationApi.updateAfterMessage(
      selectedConversation.value.id,
      messageContent,
      1
    )

    selectedConversation.value.lastMessageContent = messageContent
    selectedConversation.value.lastMessageAt = new Date().toISOString()

    chatWindowRef.value?.scrollToBottom()
  } catch (error) {
    console.error('Error sending message:', error)
  }
}

async function handleCloseConversation() {
  try {
    if (!selectedConversation.value) return

    await conversationApi.close(selectedConversation.value.id)

    selectedConversation.value.status = 'closed'

    await loadConversations()
  } catch (error) {
    console.error('Error closing conversation:', error)
  }
}

async function handleReopenConversation() {
  try {
    if (!selectedConversation.value) return

    await conversationApi.reopen(selectedConversation.value.id)

    selectedConversation.value.status = 'active'

    await loadConversations()
  } catch (error) {
    console.error('Error reopening conversation:', error)
  }
}

function handleLogout() {
  authService.logout()
  window.location.href = '/login'
}

onMounted(() => {
  loadConversations()
})
</script>

<style scoped>
.adviser-dashboard-page {
  width: 100%;
  height: calc(100vh - 80px);
  padding: 1.5rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.page-header {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-header h1 {
  font-size: 1.75rem;
  margin: 0;
  color: var(--vt-c-indigo);
}

.logout-btn {
  background: var(--vt-c-indigo);
  border: none;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.6rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
  border-radius: 0.375rem;
  font-weight: 500;
}

.logout-btn:hover {
  background: #1e2b37;
}

.logout-btn i {
  font-size: 1rem;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  font-size: 1.2rem;
  color: #666;
}

.dashboard-layout {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 1.5rem;
  flex: 1;
  min-height: 0;
}

.conversations-panel,
.chat-panel {
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.tabs-container {
  display: flex;
  gap: 0;
  background: white;
  border-radius: 0.5rem 0.5rem 0 0;
  border: 1px solid var(--color-border, #e5e7eb);
  border-bottom: none;
  overflow: hidden;
}

.tab {
  flex: 1;
  padding: 0.875rem 1rem;
  background: var(--vt-c-white-mute, #f2f2f2);
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  transition: all 0.2s;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.tab:hover {
  background: #e8e8e8;
}

.tab.active {
  background: white;
  color: var(--vt-c-indigo, #2c3e50);
  border-bottom: 2px solid var(--vt-c-indigo, #2c3e50);
}

.tab .badge {
  background: #ef4444;
  color: white;
  border-radius: 50%;
  min-width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0 0.4rem;
}

.empty-chat-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border, #e5e7eb);
  color: #666;
  padding: 2rem;
  text-align: center;
}

.empty-chat-state p {
  margin-top: 1rem;
  font-size: 1.1rem;
}

.empty-chat-state .hint {
  font-size: 0.9rem;
  color: #999;
  margin-top: 0.5rem;
}

.assign-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border, #e5e7eb);
  padding: 2rem;
}

.assign-card {
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
}

.assign-card h3 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--vt-c-indigo, #2c3e50);
}

.assign-card > p {
  margin: 0;
  color: #666;
  font-size: 1rem;
}

.conversation-preview {
  background: var(--vt-c-white-soft, #f8f8f8);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 0.5rem;
  padding: 1.25rem;
  width: 100%;
  text-align: left;
}

.conversation-preview strong {
  display: block;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: var(--vt-c-indigo, #2c3e50);
}

.conversation-preview p {
  margin: 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

.conversation-preview .last-message {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border, #e5e7eb);
  font-style: italic;
  color: #888;
}

.button-group {
  display: flex;
  gap: 1rem;
  width: 100%;
}

@media (max-width: 1024px) {
  .dashboard-layout {
    grid-template-columns: 350px 1fr;
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .adviser-dashboard-page {
    padding: 1rem;
    height: calc(100vh - 60px);
  }

  .page-header h1 {
    font-size: 1.5rem;
  }

  .dashboard-layout {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .conversations-panel {
    max-height: 300px;
  }

  .chat-panel {
    flex: 1;
  }
}
</style>
