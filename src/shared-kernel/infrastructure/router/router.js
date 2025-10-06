import HomePage from '@/contexts/public/pages/home-page.page.vue'
import AboutPage from '@/contexts/public/pages/about-page.page.vue'
import NotFoundComponent from '@/shared-kernel/presentation/ui/components/not-found.component.vue'
import TeleconsultationsPage from '@/contexts/teleconsultations/presentation/pages/teleconsultations.page.vue'
import RemindersPage from '@/contexts/reminders/presentation/pages/reminders.page.vue'
import NewReminderPage from '@/contexts/reminders/presentation/pages/new-reminder.page.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', component: HomePage },
    { path: '/about', component: AboutPage, exact: true },
    { path: '/teleconsultations', name: 'teleconsultations', component: TeleconsultationsPage, exact: true },
    
    { path: '/reminders', name: 'reminders', component: RemindersPage, exact: true },
    { path: '/reminders/new', name: 'new-reminder', component: NewReminderPage, exact: true },

    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundComponent },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router

