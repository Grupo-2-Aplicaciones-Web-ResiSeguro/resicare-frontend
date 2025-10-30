import HomePage from '@/contexts/public/pages/home-page.page.vue'
import AboutPage from '@/contexts/public/pages/about-page.page.vue'
import NotFoundComponent from '@/shared-kernel/presentation/ui/components/not-found.component.vue'
import TeleconsultationsPage from '@/contexts/teleconsultations/presentation/pages/teleconsultations.page.vue'
import RemindersPage from '@/contexts/reminders/presentation/pages/reminders.page.vue'
import NewReminderPage from '@/contexts/reminders/presentation/pages/new-reminder.page.vue'
// Claims context (unified)
import ClaimsListPage from '@/contexts/claims/presentation/pages/claims-list.page.vue'
import NewClaimPage from '@/contexts/claims/presentation/pages/new-claim.page.vue'
import ClaimDetailPage from '@/contexts/claims/presentation/pages/claim-detail.page.vue'
import ClaimDownloadPage from '@/contexts/claims/presentation/pages/claim-download.page.vue'
import ClaimsHistoryPage from '@/contexts/claims/presentation/pages/claims-history.page.vue'

import RegisterObjectPage from '@/contexts/registered-objects/presentation/pages/register-object.page.vue'
import ReimbursementSimulatorPage from '@/contexts/reimbursement-simulator/presentation/pages/reimbursement-simulator.page.vue'
import LoginPage from '@/contexts/iam/presentation/Login.vue'
import RegisterPage from '@/contexts/iam/presentation/Register.vue'
import ProfilePage from '@/contexts/profiles/presentation/pages/profile.page.vue'
import ProfileEditPage from '@/contexts/profiles/presentation/pages/profile-edit.page.vue'

// Chat context
import ChatPage from '@/contexts/chat/presentation/pages/chat.page.vue'
import AdviserDashboardPage from '@/contexts/chat/presentation/pages/adviser-dashboard.page.vue'

import { createRouter, createWebHistory } from 'vue-router'
import { TokenService } from '@/contexts/iam/infraestructure/token.service.js'
import { isAdviser } from '@/shared-kernel/infrastructure/auth/auth.guards.js'


const routes = [
  { path: '/', redirect: '/login' },

  { path: '/home', name: 'home', component: HomePage, meta: { requiresAuth: true } },

  { path: '/about', component: AboutPage },
  { path: '/teleconsultations', name: 'teleconsultations', component: TeleconsultationsPage },

  { path: '/login', name: 'login', component: LoginPage },
  { path: '/register', name: 'register', component: RegisterPage },

  // My Claims (pendientes/in_review)
  { path: '/claims', name: 'claims', component: ClaimsListPage, meta: { requiresAuth: true } },
  // ruta para ver el historial de claims resueltos
  { path: '/claims/history', name: 'claims-history', component: ClaimsHistoryPage, meta: { requiresAuth: true } },

  { path: '/claims/new', name: 'new-claim', component: NewClaimPage, meta: { requiresAuth: true } },
  { path: '/claims/:id', name: 'claim-detail', component: ClaimDetailPage, props: true, meta: { requiresAuth: true } },
  { path: '/claims/:id/download', name: 'claim-download', component: ClaimDownloadPage, props: true, meta: { requiresAuth: true } },

  { path: '/profile', name: 'profile-self', component: ProfilePage, meta: { requiresAuth: true } },
  { path: '/profile/:userId', name: 'profile', component: ProfilePage, meta: { requiresAuth: true }, props: true },

  { path: '/profile/edit', name: 'profile-edit-self', component: ProfileEditPage, meta: { requiresAuth: true } },
  { path: '/profile/:userId/edit', name: 'profile-edit', component: ProfileEditPage, meta: { requiresAuth: true }, props: true },

  { path: '/reminders', name: 'reminders', component: RemindersPage, meta: { requiresAuth: true } },
  { path: '/reminders/new', name: 'new-reminder', component: NewReminderPage, meta: { requiresAuth: true } },

  { path: '/register-object', name: 'register-object', component: RegisterObjectPage, meta: { requiresAuth: true } },
  { path: '/reimbursement-simulator', name: 'reimbursement-simulator', component: ReimbursementSimulatorPage, meta: { requiresAuth: true } },

  // Chat routes
  { path: '/chat/:claimId', name: 'chat', component: ChatPage, props: true, meta: { requiresAuth: true } },
  { path: '/adviser/dashboard', name: 'adviser-dashboard', component: AdviserDashboardPage, meta: { requiresAuth: true, requiresAdviser: true } },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundComponent },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const token = TokenService?.get ? TokenService.get() : localStorage.getItem('accessToken_v1')
  const isAuthRoute = (to.path === '/login' || to.path === '/register')

  if (!token && !isAuthRoute) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  if (token && isAuthRoute) {
    if (isAdviser()) {
      return next({ path: '/adviser/dashboard' })
    }
    return next({ path: '/home' })
  }

  if (to.meta?.requiresAuth && !token) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }
  if (to.path === '/home' && isAdviser()) {
    return next({ path: '/adviser/dashboard' })
  }

  if (to.meta?.requiresAdviser && !isAdviser()) {
    console.warn('Access denied: User is not an adviser')
    return next({
      path: '/home',
      query: { error: 'unauthorized' }
    })
  }

  next()
})

export default router
