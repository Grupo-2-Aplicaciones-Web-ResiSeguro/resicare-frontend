<template>
  <header class="header" role="banner" :aria-label="$t('aria.header')">
    <div class="logo" :aria-label="$t('aria.logo')">
      {{ $t('layout.header.logo') }}
    </div>
    <nav class="nav" role="navigation" :aria-label="$t('aria.navigation')">
      <LanguageSelector />
    </nav>
  </header>
</template>

<script setup lang="ts">
import LanguageSelector from "../../ui/components/language-selector.component.vue"
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--color-background-soft);
  border-bottom: 1px solid var(--color-border);
  font-size: 1.2rem;
  font-weight: 500;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
}

.logo {
  color: var(--color-heading);
  font-size: 1.4rem;
  font-weight: bold;
}

.nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
