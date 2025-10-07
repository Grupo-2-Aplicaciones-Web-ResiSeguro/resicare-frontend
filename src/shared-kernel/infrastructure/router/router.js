import HomePage from '@/contexts/public/pages/home-page.page.vue'
import AboutPage from '@/contexts/public/pages/about-page.page.vue'
import NotFoundComponent from '@/shared-kernel/presentation/ui/components/not-found.component.vue'
import TeleconsultationsPage from '@/contexts/teleconsultations/presentation/pages/teleconsultations.page.vue'

// --- Reminders ---
import RemindersPage from '@/contexts/reminders/presentation/pages/reminders.page.vue'
import NewReminderPage from '@/contexts/reminders/presentation/pages/new-reminder.page.vue'

// --- Claims (nuevo reclamo y objetos registrados) ---
import NewClaimPage from '@/contexts/claims/presentation/pages/new-claim.page.vue'
import RegisterObjectPage from '@/contexts/registered-objects/presentation/pages/register-object.page.vue'

// --- Reembolso / Simulador ---
import ReimbursementSimulatorPage from '@/contexts/reimbursement-simulator/presentation/pages/reimbursement-simulator.page.vue'

// --- Historial y detalles de reclamos ---
import ClaimsHistoryPage from '@/contexts/claimsdetailslist/presentation/pages/claims-history.page.vue'
import ClaimDetailPage from '@/contexts/claimsdetailslist/presentation/pages/claim-detail.page.vue'
import ClaimDownloadPage from '@/contexts/claimsdetailslist/presentation/pages/claim-download.page.vue'

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // --- Públicas ---
  { path: '/', component: HomePage },
  { path: '/about', component: AboutPage, exact: true },

  // --- Teleconsultas ---
  { path: '/teleconsultations', name: 'teleconsultations', component: TeleconsultationsPage, exact: true },

  // --- Reclamos (crear nuevo) ---
  { path: '/new-claim', name: 'new-claim', component: NewClaimPage, exact: true },
  { path: '/register-object', name: 'register-object', component: RegisterObjectPage, exact: true },

  // --- Historial y Detalle de Reclamos ---
  { path: '/claims', name: 'claims', component: ClaimsHistoryPage, exact: true },
  { path: '/claims/:id', name: 'claimDetail', component: ClaimDetailPage, exact: true },
  { path: '/claims/:id/download', name: 'claimDownload', component: ClaimDownloadPage, exact: true },

  // --- Recordatorios ---
  { path: '/reminders', name: 'reminders', component: RemindersPage, exact: true },
  { path: '/reminders/new', name: 'new-reminder', component: NewReminderPage, exact: true },

  // --- Simulador de Reembolso ---
  { path: '/reimbursement-simulator', name: 'reimbursement-simulator', component: ReimbursementSimulatorPage, exact: true },

  // --- Página no encontrada ---
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundComponent },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
