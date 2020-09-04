<template>
  <v-app dark>
    <v-content>
      <div class="container d-flex align-stretch justify-space-between flex-row">
        <div class="narrow d-flex flex-column justify-space-between">
          <pd-clock />
          <pd-shortcuts />
        </div>
        <div class="narrow d-flex flex-column justify-space-between">
          <pd-targets />
          <pd-today-todos />
        </div>
      </div>
    </v-content>
  </v-app>
</template>

<script>

import pdClock from './components/Clock.vue';
import pdShortcuts from './components/Shortcuts.vue';
import pdTargets from './components/Targets.vue';
import pdTodayTodos from './components/TodayTodos.vue';

export default {
  name: 'App',
  components: {
    pdClock, pdShortcuts, pdTodayTodos, pdTargets
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
</style>
