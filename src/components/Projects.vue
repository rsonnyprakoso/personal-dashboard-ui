<template>
  <div class="pd-projects">
    <div class="heading d-flex align-baseline text-body-1">
      Your
      <b
        ><u>
          <v-select
            :items="statuses"
            v-model="selectedStatus"
            class="cycle-select"
            solo
            flat
            background-color="transparent"
            dense
            hide-details
          /> </u
      ></b>
      projects
    </div>
    <apollo-query :query="query" :variables="{ status: selectedStatus }" fetch-policy="network-only">
      <template v-slot="{ result: { data }, isLoading }">
        <v-progress-circular
          v-if="isLoading"
          indeterminate
          color="white"
        ></v-progress-circular>
        <div
          :key="selectedStatus"
          v-else
          class="d-flex flex-column justify-flex-start"
        >
          <pd-project-item
            v-for="project in data.allProjects"
            :key="project.id"
            v-bind="project"
            :refetchQueries="[{ query, variables: { status: selectedStatus } }]"
            :inactive="!!(editedProjectId && editedProjectId !== project.id)"
            @startEdit="editedProjectId = project.id"
            @doneEdit="editedProjectId = ''"
          />
          <pd-project-item
            v-if="editedProjectId === 'new'"
            v-bind="newProject"
            :refetchQueries="[{ query, variables: { status: selectedStatus } }]"
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
            <span>Add {{ selectedStatusName }} project</span>
          </v-btn>
        </div>
      </template>
    </apollo-query>
  </div>
</template>

<script>
import pdProjectItem from "../components/ProjectItem";
import { getProjectsByStatusQuery } from "../gql/project";

export default {
  name: "pd-projects",
  components: {
    pdProjectItem,
  },
  data: function () {
    return {
      selectedStatus: 3,
      query: getProjectsByStatusQuery,
      editedProjectId: "",
      adding: false,
      statuses: [
        { text: "to-do", value: 1 },
        { text: "upcoming", value: 2 },
        { text: "ongoing", value: 3 },
        { text: "postponed", value: 4 },
        { text: "completed", value: 5 },
      ],
    };
  },
  methods: {
    doneAdd: function () {
      this.editedProjectId = "";
      this.newProject = {
        name: "",
        priority: "",
      };
    },
  },
  computed: {
    selectedStatusName: function () {
      const status = this.statuses.find((s) => s.value === this.selectedStatus);
      return (status && status.text) || "";
    },
    newProject: function() {
      return {
        name: "",
        priority: "",
        status: this.selectedStatus
      }
    },
  },
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