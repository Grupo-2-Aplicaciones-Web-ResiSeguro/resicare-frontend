import { http } from '@/shared-kernel/infrastructure/http/http.js'
export class MessageApiService {
  static RESOURCE = '/messages'

  /**
   * Get all messages
   * @returns {Promise} Axios response with messages array
   */
  async getAll() {
    return http.get(MessageApiService.RESOURCE)
  }

  /**
   * Get message by ID
   * @param {string} id - Message ID
   * @returns {Promise} Axios response with message object
   */
  async getById(id) {
    return http.get(`${MessageApiService.RESOURCE}/${id}`)
  }

  /**
   * Get all messages for a specific conversation
   * @param {string} conversationId - Conversation ID
   * @returns {Promise} Axios response with messages array
   */
  async getByConversationId(conversationId) {
    return http.get(`${MessageApiService.RESOURCE}?conversationId=${conversationId}&_sort=timestamp&_order=asc`)
  }

  /**
   * Get unread messages for a conversation
   * @param {string} conversationId - Conversation ID
   * @returns {Promise} Axios response with messages array
   */
  async getUnreadByConversationId(conversationId) {
    return http.get(`${MessageApiService.RESOURCE}?conversationId=${conversationId}&isRead=false&_sort=timestamp&_order=asc`)
  }

  /**
   * Create a new message
   * @param {Object} messageData - Message data (without ID)
   * @returns {Promise} Axios response with created message
   */
  async create(messageData) {
    return http.post(MessageApiService.RESOURCE, messageData)
  }

  /**
   * Update a message (mainly for marking as read)
   * @param {string} id - Message ID
   * @param {Object} updates - Fields to update
   * @returns {Promise} Axios response with updated message
   */
  async update(id, updates) {
    return http.patch(`${MessageApiService.RESOURCE}/${id}`, updates)
  }

  /**
   * Mark message as read
   * @param {string} id - Message ID
   * @returns {Promise} Axios response with updated message
   */
  async markAsRead(id) {
    return this.update(id, { isRead: true })
  }

  /**
   * Mark multiple messages as read
   * @param {Array<string>} messageIds - Array of message IDs
   * @returns {Promise<Array>} Array of promises for each update
   */
  async markMultipleAsRead(messageIds) {
    const promises = messageIds.map(id => this.markAsRead(id))
    return Promise.all(promises)
  }

  /**
   * Delete a message
   * @param {string} id - Message ID
   * @returns {Promise} Axios response
   */
  async delete(id) {
    return http.delete(`${MessageApiService.RESOURCE}/${id}`)
  }

  /**
   * Get messages sent after a specific timestamp (for polling)
   * @param {string} conversationId - Conversation ID
   * @param {string} afterTimestamp - ISO timestamp
   * @returns {Promise} Axios response with messages array
   */
  async getNewMessages(conversationId, afterTimestamp) {
    return http.get(`${MessageApiService.RESOURCE}?conversationId=${conversationId}&timestamp_gte=${afterTimestamp}&_sort=timestamp&_order=asc`)
  }
}
