<template>
  <div class="pd-today-focus">
    <v-tabs-items v-model="mode" background-color="transparent">
      <v-tab-item class="task" key="task">
        <pd-todos />
      </v-tab-item>
      <v-tab-item class="project" key="project">
        <pd-projects />
      </v-tab-item>
      <v-tab-item class="target" key="target">
        <pd-targets />
      </v-tab-item>
    </v-tabs-items>
    <v-tabs grow v-model="mode" :height="36" color="white" background-color="transparent">
      <v-tab small key="task">Task</v-tab>
      <v-tab small key="project">Project</v-tab>
      <v-tab small key="target">Target</v-tab>
    </v-tabs>
  </div>
</template>

<script>
import pdTodos from "../components/Todos";
import pdTargets from "../components/Targets";
import pdProjects from "../components/Projects";

export default {
  name: "pd-today-focus",
  components: {
    pdTodos,
    pdTargets,
    pdProjects,
  },
  data: function () {
    return {
      mode: "task",
    };
  },
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.pd-today-focus {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  .heading {
    text-align: left;
    margin-bottom: 12px;
  }
}

.v-tabs-items {
  background-color: transparent !important;
  margin-bottom: 8px;
}

.switcher {
  flex: 1;
}
</style>