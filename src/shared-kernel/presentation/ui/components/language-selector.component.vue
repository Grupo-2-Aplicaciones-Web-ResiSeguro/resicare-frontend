<template>
  <div class="language-selector">
    <pv-dropdown
      v-model="selected"
      :options="options"
      optionLabel="label"
      optionValue="value"
      :placeholder="$t('common.selectLanguage')"
      :aria-label="$t('aria.languageSelector')"
      role="listbox"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const selected = ref(locale.value)

const availableLocales = import.meta.env.VITE_I18N_LOCALES?.split(',') || ['en', 'es']

const options = availableLocales.map((code) => ({
  label: new Intl.DisplayNames([code], { type: 'language' }).of(code),
  value: code,
}))

watch(selected, (newLocale) => {
  locale.value = newLocale
})
</script>

<style scoped>
.language-selector {
  width: 200px;
}
</style>
