import { http } from '@/shared-kernel/infrastructure/http/http.js'

export class ConversationApiService {
  static RESOURCE = '/conversations'

  /**
   * Get all conversations
   * @returns {Promise} Axios response with conversations array
   */
  async getAll() {
    return http.get(`${ConversationApiService.RESOURCE}?_sort=updatedAt&_order=desc`)
  }

  /**
   * Get conversation by ID
   * @param {string} id - Conversation ID
   * @returns {Promise} Axios response with conversation object
   */
  async getById(id) {
    return http.get(`${ConversationApiService.RESOURCE}/${id}`)
  }

  /**
   * Get conversation by claim ID
   * @param {string} claimId - Claim ID
   * @returns {Promise} Axios response with conversations array
   */
  async getByClaimId(claimId) {
    return http.get(`${ConversationApiService.RESOURCE}?claimId=${claimId}`)
  }

  /**
   * Get all conversations for a specific client
   * @param {string} clientId - Client user ID
   * @returns {Promise} Axios response with conversations array
   */
  async getByClientId(clientId) {
    return http.get(`${ConversationApiService.RESOURCE}?clientId=${clientId}&_sort=updatedAt&_order=desc`)
  }

  /**
   * Get all conversations assigned to an adviser
   * @param {string} adviserId - Adviser user ID
   * @returns {Promise} Axios response with conversations array
   */
  async getByAdviserId(adviserId) {
    return http.get(`${ConversationApiService.RESOURCE}?adviserId=${adviserId}&_sort=updatedAt&_order=desc`)
  }

  /**
   * Get all conversations by status
   * @param {string} status - Status ('active', 'pending', 'closed')
   * @returns {Promise} Axios response with conversations array
   */
  async getByStatus(status) {
    return http.get(`${ConversationApiService.RESOURCE}?status=${status}&_sort=updatedAt&_order=desc`)
  }

  /**
   * Get pending (unassigned) conversations
   * @returns {Promise} Axios response with conversations array
   */
  async getPending() {
    return this.getByStatus('pending')
  }

  /**
   * Get active conversations
   * @returns {Promise} Axios response with conversations array
   */
  async getActive() {
    return this.getByStatus('active')
  }

  /**
   * Create a new conversation
   * @param {Object} conversationData - Conversation data (without ID)
   * @returns {Promise} Axios response with created conversation
   */
  async create(conversationData) {
    return http.post(ConversationApiService.RESOURCE, conversationData)
  }

  /**
   * Update a conversation
   * @param {string} id - Conversation ID
   * @param {Object} updates - Fields to update
   * @returns {Promise} Axios response with updated conversation
   */
  async update(id, updates) {
    return http.patch(`${ConversationApiService.RESOURCE}/${id}`, updates)
  }

  /**
   * Assign an adviser to a conversation
   * @param {string} id - Conversation ID
   * @param {string} adviserId - Adviser user ID
   * @param {string} adviserName - Adviser name
   * @returns {Promise} Axios response with updated conversation
   */
  async assignAdviser(id, adviserId, adviserName) {
    return this.update(id, {
      adviserId,
      adviserName,
      status: 'active',
      updatedAt: new Date().toISOString()
    })
  }

  /**
   * Update conversation metadata after new message
   * @param {string} id - Conversation ID
   * @param {string} messageContent - Content of the new message
   * @param {number} unreadIncrement - How much to increment unread count (0 or 1)
   * @returns {Promise} Axios response with updated conversation
   */
  async updateAfterMessage(id, messageContent, unreadIncrement = 1) {
    const now = new Date().toISOString()

    const response = await this.getById(id)
    const currentUnreadCount = response.data.unreadCount || 0

    return this.update(id, {
      lastMessageContent: messageContent,
      lastMessageAt: now,
      updatedAt: now,
      unreadCount: currentUnreadCount + unreadIncrement
    })
  }

  /**
   * Reset unread count for a conversation
   * @param {string} id - Conversation ID
   * @returns {Promise} Axios response with updated conversation
   */
  async resetUnreadCount(id) {
    return this.update(id, { unreadCount: 0 })
  }

  /**
   * Close a conversation
   * @param {string} id - Conversation ID
   * @returns {Promise} Axios response with updated conversation
   */
  async close(id) {
    return this.update(id, {
      status: 'closed',
      updatedAt: new Date().toISOString()
    })
  }

  /**
   * Reopen a closed conversation
   * @param {string} id - Conversation ID
   * @returns {Promise} Axios response with updated conversation
   */
  async reopen(id) {
    return this.update(id, {
      status: 'active',
      updatedAt: new Date().toISOString()
    })
  }

  /**
   * Delete a conversation
   * @param {string} id - Conversation ID
   * @returns {Promise} Axios response
   */
  async delete(id) {
    return http.delete(`${ConversationApiService.RESOURCE}/${id}`)
  }

  /**
   * Check if a conversation exists for a claim
   * @param {string} claimId - Claim ID
   * @returns {Promise<boolean>} True if conversation exists
   */
  async existsForClaim(claimId) {
    const response = await this.getByClaimId(claimId)
    return response.data && response.data.length > 0
  }

  /**
   * Get or create conversation for a claim
   * @param {string} claimId - Claim ID
   * @param {string} clientId - Client ID
   * @param {string} clientName - Client name
   * @returns {Promise} Axios response with conversation
   */
  async getOrCreateForClaim(claimId, clientId, clientName) {
    const existingResponse = await this.getByClaimId(claimId)

    if (existingResponse.data && existingResponse.data.length > 0) {
      return existingResponse.data[0]
    }

    const now = new Date().toISOString()
    const newConversationData = {
      claimId,
      clientId,
      clientName,
      adviserId: null,
      adviserName: null,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      unreadCount: 0,
      lastMessageContent: null,
      lastMessageAt: null
    }

    const createResponse = await this.create(newConversationData)
    return createResponse.data
  }
}
