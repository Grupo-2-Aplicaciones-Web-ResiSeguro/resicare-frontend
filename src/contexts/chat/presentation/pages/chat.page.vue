<template>
  <div class="chat-page">
    <ChatWindow
      :title="chatTitle"
      :subtitle="chatSubtitle"
      :messages="messages"
      :loading="loading"
      :status="conversation?.status"
      :show-back-button="true"
      @send-message="sendMessage"
      @close="goBack"
      ref="chatWindowRef"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ChatWindow from '../components/chat-window.component.vue'
import { MessageApiService } from '@/contexts/chat/infrastructure'
import { ConversationApiService } from '@/contexts/chat/infrastructure'
import { MessageAssembler } from '@/contexts/chat/Domain'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const messageApi = new MessageApiService()
const conversationApi = new ConversationApiService()

const messages = ref([])
const conversation = ref(null)
const loading = ref(true)
const claimId = ref(route.params.claimId || '1')
const chatWindowRef = ref(null)

const chatTitle = computed(() => {
  if (conversation.value) {
    return `${t('chat.chatWith')} ${conversation.value.adviserName || t('chat.status.pending')}`
  }
  return t('chat.conversations')
})

const chatSubtitle = computed(() => {
  if (conversation.value) {
    return `${t('chat.aboutClaim')} #${conversation.value.claimId}`
  }
  return ''
})

async function loadConversation() {
  try {
    loading.value = true

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')

    const conv = await conversationApi.getOrCreateForClaim(
      claimId.value,
      currentUser.id || '1',
      currentUser.nombre || 'Usuario'
    )

    conversation.value = conv

    await loadMessages()
  } catch (error) {
    console.error('Error loading conversation:', error)
  } finally {
    loading.value = false
  }
}

async function loadMessages() {
  try {
    if (!conversation.value) return

    const response = await messageApi.getByConversationId(conversation.value.id)
    messages.value = MessageAssembler.toEntitiesFromResponse(response)
  } catch (error) {
    console.error('Error loading messages:', error)
  }
}

async function sendMessage(messageContent) {
  try {
    if (!conversation.value) return

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')

    const newMessageData = MessageAssembler.createNewMessage({
      conversationId: conversation.value.id,
      senderId: currentUser.id || '1',
      senderName: currentUser.nombre || 'Usuario',
      senderRole: 'cliente',
      content: messageContent
    })

    const response = await messageApi.create(newMessageData)
    const newMessage = MessageAssembler.toEntity(response.data)

    messages.value.push(newMessage)

    await conversationApi.updateAfterMessage(
      conversation.value.id,
      messageContent,
      0
    )

    chatWindowRef.value?.scrollToBottom()
  } catch (error) {
    console.error('Error sending message:', error)
  }
}

function goBack() {
  router.push({ name: 'claim-detail', params: { id: claimId.value } })
}

onMounted(() => {
  loadConversation()
})
</script>

<style scoped>
.chat-page {
  height: calc(100vh - 80px);
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

@media (max-width: 768px) {
  .chat-page {
    padding: 0.5rem;
    height: calc(100vh - 60px);
  }
}
</style>
