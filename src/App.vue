<template>
  <v-app dark>
    <v-content>
      <div class="container d-flex align-stretch justify-space-between flex-row">
        <div class="left-side narrow d-flex flex-column justify-space-between">
          <pd-clock />
          <pd-shortcuts />
        </div>
        <div class="right-side narrow d-flex flex-column justify-space-between">
          <pd-today-focus />
        </div>
      </div>
    </v-content>
  </v-app>
</template>

<script>

import pdClock from './components/Clock.vue';
import pdShortcuts from './components/Shortcuts.vue';
import pdTodayFocus from './components/TodayFocus.vue';

export default {
  name: 'App',
  components: {
    pdClock, pdShortcuts, pdTodayFocus
  }
}
</script>

<style>
.v-application {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  background: transparent !important;
  padding: 48px;
  height: 100%;
}

.v-application--wrap {
  min-height: unset !important;
  height: 100%;
}

.container {
  height: 100%;
}

.narrow {
  width: 320px;
}

.left-side, .right-side {
  position: relative;
}
</style>
