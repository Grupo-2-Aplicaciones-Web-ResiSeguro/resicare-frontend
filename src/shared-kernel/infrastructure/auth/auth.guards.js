/**
 * Obtiene el usuario actual desde localStorage
 * @returns {Object|null} Usuario actual o null si no existe
 */
export function getCurrentUser() {
  try {
    const currentUserRaw = localStorage.getItem('currentUser')
    if (!currentUserRaw) return null

    const user = JSON.parse(currentUserRaw)
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Verifica si el usuario actual tiene rol de asesor
 * @returns {boolean} True si es asesor, false en caso contrario
 */
export function isAdviser() {
  const user = getCurrentUser()
  if (!user) return false

  // Verificar tanto 'role' como 'rol' para compatibilidad
  const userRole = user.role || user.rol
  return userRole === 'adviser' || userRole === 'asesor'
}

/**
 * Verifica si el usuario actual tiene rol de cliente
 * @returns {boolean} True si es cliente, false en caso contrario
 */
export function isClient() {
  const user = getCurrentUser()
  if (!user) return false

  const userRole = user.role || user.rol
  return userRole === 'client' || userRole === 'cliente'
}

/**
 * Verifica si el usuario tiene un rol específico
 * @param {string} role - Rol a verificar
 * @returns {boolean} True si el usuario tiene ese rol
 */
export function hasRole(role) {
  const user = getCurrentUser()
  if (!user) return false

  const userRole = user.role || user.rol
  return userRole === role
}

/**
 * Guard para rutas que requieren rol de asesor
 * Uso en router: beforeEach((to, from, next) => requiresAdviserGuard(to, from, next))
 *
 * @param {Object} to - Ruta destino
 * @param {Object} from - Ruta origen
 * @param {Function} next - Función next del router
 */
export function requiresAdviserGuard(to, from, next) {
  if (to.meta?.requiresAdviser && !isAdviser()) {
    console.warn('Access denied: User is not an adviser')
    // Redirigir al home con mensaje
    return next({
      path: '/home',
      query: { error: 'unauthorized' }
    })
  }
  next()
}
