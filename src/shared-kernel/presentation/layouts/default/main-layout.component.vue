<template>
  <div class="main-layout">
    <HeaderBar class="header" />
    <main class="page-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import HeaderBar from './header-bar.component.vue'
</script>

<style scoped>
.main-layout {
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "header"
    "content";
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  box-sizing: border-box;
}

.header {
  grid-area: header;
  width: 100vw;
  min-width: 0;
  overflow-x: hidden;
}

.page-content {
  grid-area: content;
  padding: 1rem;
  overflow-y: auto;
  width: 100vw;
  min-width: 0;
  overflow-x: hidden;
}
</style>
