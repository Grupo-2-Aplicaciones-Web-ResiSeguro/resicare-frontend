import HomePage from '@/contexts/public/pages/home-page.page.vue'
import AboutPage from '@/contexts/public/pages/about-page.page.vue'
import NotFoundComponent from '@/shared-kernel/presentation/ui/components/not-found.component.vue'
import TeleconsultationsPage from '@/contexts/teleconsultations/presentation/pages/teleconsultations.page.vue'
import ClaimsHistoryPage from '@/contexts/claimsdetailslist/presentation/pages/claims-history.page.vue'
import ClaimDetailPage from '@/contexts/claimsdetailslist/presentation/pages/claim-detail.page.vue'
import ClaimDownloadPage from '@/contexts/claimsdetailslist/presentation/pages/claim-download.page.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: HomePage },
  { path: '/about', component: AboutPage, exact: true },
  { path: '/teleconsultations', name: 'teleconsultations', component: TeleconsultationsPage, exact: true },
  { path: '/claims', name: 'claims', component: ClaimsHistoryPage, exact: true },
  { path: '/claims/:id', name: 'claimDetail', component: ClaimDetailPage, exact: true },
  { path: '/claims/:id/download', name: 'claimDownload', component: ClaimDownloadPage, exact: true },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundComponent },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
