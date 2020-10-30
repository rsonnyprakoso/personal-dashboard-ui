<template>
  <apollo-query :query="query">
    <template v-slot="{ result: { data }, isLoading }">
      <v-progress-circular
        v-if="isLoading"
        indeterminate
        color="white"
      ></v-progress-circular>
      <div v-else class="pd-projects d-flex flex-column justify-flex-start">
        <pd-project-item
          v-for="project in data.allProjects"
          :key="project.id"
          v-bind="project"
          :refetchQueries="[{ query }]"
          :inactive="!!(editedProjectId && editedProjectId !== project.id)"
          @startEdit="editedProjectId = project.id"
          @doneEdit="editedProjectId = ''"
        />
        <pd-project-item
          v-if="editedProjectId === 'new'"
          v-bind="newProject"
          :refetchQueries="[{ query }]"
          @doneEdit="doneAdd"
          :inactive="false"
          force-edit
        />
        <v-btn
          @click="editedProjectId = 'new'"
          class="add-button text-body-1"
          text
          color="white"
          v-bind="attrs"
          v-on="on"
          :disabled="!!editedProjectId"
        >
          <v-icon small>mdi-plus</v-icon>
          <span>Add Project</span>
        </v-btn>
      </div>
    </template>
  </apollo-query>
</template>

<script>
import pdProjectItem from "../components/ProjectItem";
import { getAllProjectsQuery } from "../gql/project";

export default {
  name: "pd-projects",
  components: {
    pdProjectItem,
  },
  data: function () {
    return {
      query: getAllProjectsQuery,
      editedProjectId: "",
      adding: false,
      newProject: {
        name: '',
        priority: ''
      }
    };
  },
  methods: {
    doneAdd: function() {
      this.editedProjectId = '';
      this.newProject = {
        name: '',
        priority: ''
      }
    }
  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.pd-projects {
  .today-list-move {
    transition: 0.2s transform;
  }

  .heading {
    text-align: left;
    margin-bottom: 12px;
  }
}

.v-menu__content {
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  top: unset !important;
}

.add-button {
  background-color: rgba(255, 255, 255, 0.2);
  margin-top: 8px;
  padding: 4px 8px !important;
  text-transform: none;
  justify-content: flex-start;
}
</style>