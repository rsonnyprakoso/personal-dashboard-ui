<template>
  <v-app dark>
    <v-content>
      <div class="container d-flex align-stretch justify-space-between flex-row">
        <div class="narrow d-flex flex-column justify-space-between">
          <pd-clock />
          <pd-shortcuts />
        </div>
      </div>
    </v-content>
  </v-app>
</template>

<script>

import pdClock from './components/Clock.vue';
import pdShortcuts from './components/Shortcuts.vue';

export default {
  name: 'App',
  components: {
    pdClock, pdShortcuts
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
  max-width: 320px;
}
</style>
