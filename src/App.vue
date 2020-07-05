<template>
  <div id="app">
    <clock class="narrow" />
  </div>
</template>

<script>

import Clock from './components/Clock.vue'

export default {
  name: 'App',
  components: {
    Clock
  }
}
</script>

<style>
#app {
  font-family: 'Lato', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  padding: 48px;
}

.narrow {
  max-width: 320px;
}
</style>
