<template>
  <div class="app-shell">
    <app-header />
    <main class="page-shell">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

.app-shell {
  min-height: 100vh;
}
</style>
