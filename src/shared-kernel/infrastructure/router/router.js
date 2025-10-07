import HomePage from '@/contexts/public/pages/home-page.page.vue'
import AboutPage from '@/contexts/public/pages/about-page.page.vue'
import NotFoundComponent from '@/shared-kernel/presentation/ui/components/not-found.component.vue'
import TeleconsultationsPage from '@/contexts/teleconsultations/presentation/pages/teleconsultations.page.vue'
import RemindersPage from '@/contexts/reminders/presentation/pages/reminders.page.vue'
import NewReminderPage from '@/contexts/reminders/presentation/pages/new-reminder.page.vue'
import NewClaimPage from '@/contexts/claims/presentation/pages/new-claim.page.vue'
import RegisterObjectPage from '@/contexts/registered-objects/presentation/pages/register-object.page.vue'
import ReimbursementSimulatorPage from '@/contexts/reimbursement-simulator/presentation/pages/reimbursement-simulator.page.vue'
import ClaimsHistoryPage from '@/contexts/claimsdetailslist/presentation/pages/claims-history.page.vue'
import ClaimDetailPage from '@/contexts/claimsdetailslist/presentation/pages/claim-detail.page.vue'
import ClaimDownloadPage from '@/contexts/claimsdetailslist/presentation/pages/claim-download.page.vue'
import LoginPage from '@/contexts/iam/presentation/Login.vue'
import RegisterPage from '@/contexts/iam/presentation/Register.vue'
import ProfilePage from '@/contexts/iam/presentation/profile.page.vue'

import { createRouter, createWebHistory } from 'vue-router'

import { TokenService } from '@/contexts/iam/infraestructure/token.service.js'


const routes = [
  { path: '/', redirect: '/login' },

  { path: '/home', name: 'home', component: HomePage, meta: { requiresAuth: true } },

  { path: '/about', component: AboutPage },
  { path: '/teleconsultations', name: 'teleconsultations', component: TeleconsultationsPage },

  { path: '/login', name: 'login', component: LoginPage },
  { path: '/register', name: 'register', component: RegisterPage },

  { path: '/profile/:userId', name: 'profile', component: ProfilePage, meta: { requiresAuth: true }, props: true },

  { path: '/reminders', name: 'reminders', component: RemindersPage, meta: { requiresAuth: true } },
  { path: '/reminders/new', name: 'new-reminder', component: NewReminderPage, meta: { requiresAuth: true } },

  { path: '/new-claim', name: 'new-claim', component: NewClaimPage, meta: { requiresAuth: true } },
  { path: '/register-object', name: 'register-object', component: RegisterObjectPage, meta: { requiresAuth: true } },
  { path: '/claims', name: 'claims', component: ClaimsHistoryPage, meta: { requiresAuth: true } },
  { path: '/claims/:id', name: 'claimDetail', component: ClaimDetailPage, props: true, meta: { requiresAuth: true } },
  { path: '/claims/:id/download', name: 'claimDownload', component: ClaimDownloadPage, props: true, meta: { requiresAuth: true } },

  { path: '/reimbursement-simulator', name: 'reimbursement-simulator', component: ReimbursementSimulatorPage, meta: { requiresAuth: true } },

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
    return next({ path: '/home' })
  }

  if (to.meta?.requiresAuth && !token) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  next()
})

export default router
