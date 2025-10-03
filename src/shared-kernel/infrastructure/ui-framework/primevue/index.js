import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import Lara from '@primeuix/themes/lara'

import Button from 'primevue/button'
import FileUpload from 'primevue/fileupload'
import DatePicker from 'primevue/datepicker'
import InputNumber from 'primevue/inputnumber'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ColumnGroup from 'primevue/columngroup'
import Row from 'primevue/row'
import Rating from 'primevue/rating'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'

export const themes = {
  aura: Aura,
  lara: Lara,
}

export function setupPrimeVue(app, selectedTheme = 'aura') {
  const preset = themes[selectedTheme] || themes.aura

  app.use(PrimeVue, {
    theme: { preset },
  })

  app.component('pv-button', Button)
  app.component('pv-file-upload', FileUpload)
  app.component('pv-date-picker', DatePicker)
  app.component('pv-input-number', InputNumber)
  app.component('pv-data-table', DataTable)
  app.component('pv-column', Column)
  app.component('pv-column-group', ColumnGroup)
  app.component('pv-row', Row)
  app.component('pv-rating', Rating)
  app.component('pv-dropdown', Dropdown)
  app.component('pv-dialog', Dialog)
  app.component('pv-input-text', InputText)
}
