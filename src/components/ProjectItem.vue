<template>
  <apollo-mutation
    :mutation="saveProject.mutation"
    :variables="saveProject.variables"
    :refetchQueries="refetchQueries"
    @done="doneEdit"
  >
    <template v-slot="{ mutate: submit, loading: updating }">
      <apollo-mutation
        :mutation="deleteMutation"
        :refetchQueries="refetchQueries"
      >
        <template v-slot="{ mutate: remove, loading: deleting }">
          <v-card
            light
            :class="`pd-project-item ${priorityName} ${
              updating || deleting ? 'loading' : ''
            } ${inactive ? 'inactive' : ''}`"
          >
            <v-card-text
              v-if="editing || forceEdit"
              class="item-content d-flex align-center"
            >
              <div class="project-form d-flex flex-column align-stretch">
                <v-text-field
                  single-line
                  dense
                  label="Project name"
                  class="project-name-field text-body-1"
                  v-model="editedName"
                  :error="error.name"
                  required
                  hide-details
                  height="24"
                />
                <div class="priority-field d-flex align-baseline text-caption">
                  <span>Priority</span>
                  <v-select
                    solo
                    flat
                    v-model="editedPriority"
                    :items="priorities"
                    dense
                    hide-details
                    single-line
                    height="20"
                  >
                    <template slot="selection" slot-scope="{ item }">
                      <span :class="`priority-item ${item.text}`">
                        {{ item.text }}
                      </span>
                    </template>
                    <template slot="item" slot-scope="{ item }">
                      <span class="priority-item">
                        <small>{{ item.text }}</small>
                      </span>
                    </template>
                  </v-select>
                </div>
              </div>
              <div class="d-flex align-flex-start">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      color="primary"
                      small
                      v-on="on"
                      @click="validateAndSubmit(submit)"
                      :disabled="!editing || inactive"
                    >
                      <v-icon small>mdi-check</v-icon>
                    </v-btn>
                  </template>
                  <span class="text-body-2">Save</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      color="error"
                      small
                      v-on="on"
                      @click="doneEdit"
                      :disabled="!editing || inactive"
                    >
                      <v-icon small>mdi-close</v-icon>
                    </v-btn>
                  </template>
                  <span class="text-body-2">Cancel</span>
                </v-tooltip>
              </div>
            </v-card-text>

            <v-card-text v-else class="item-content d-flex align-center">
              <div class="project-label d-flex flex-column align-start">
                <div class="text-body-1">{{ name }}</div>
                <span :class="`text-caption priority-label ${priorityName}`">
                  <small>{{ priorityName }}</small>
                </span>
              </div>
              <div class="d-flex align-flex-start">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      color="primary"
                      small
                      v-on="on"
                      @click="startEdit"
                      :disabled="editing || inactive"
                    >
                      <v-icon small>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span class="text-body-2">Edit</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      color="error"
                      small
                      v-on="on"
                      @click="confirmDelete = true"
                      :disabled="editing || inactive"
                    >
                      <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span class="text-body-2">Delete</span>
                </v-tooltip>
              </div>
            </v-card-text>

            <transition appear name="show-error">
              <v-alert
                v-if="hasError"
                small
                dense
                class="text-body-2"
                text
                color="red"
              >
                <ul>
                  <li
                    class="text-left"
                    v-for="errorKey in Object.keys(error)"
                    :key="errorKey"
                  >
                    {{ error[errorKey] }}
                  </li>
                </ul>
              </v-alert>
            </transition>
            <transition appear name="show-extra">
              <v-card-text
                class="extra-content blue-grey lighten-5"
                v-if="confirmDelete"
              >
                <div class="d-flex flex-column">
                  <v-alert small dense class="text-body-2" text color="red"
                    >Are you sure you want to delete this project?</v-alert
                  >
                  <div class="d-flex">
                    <v-btn
                      color="red"
                      text
                      small
                      @click="remove({ variables: { id } })"
                      >yes, delete it!</v-btn
                    >
                    <v-btn
                      color="primary"
                      text
                      small
                      @click="confirmDelete = false"
                      >no, go back</v-btn
                    >
                  </div>
                </div>
              </v-card-text>
            </transition>
          </v-card>
        </template>
      </apollo-mutation>
    </template>
  </apollo-mutation>
</template>

<script>
import {
  addProjectMutation,
  updateProjectMutation,
  deleteProjectMutation,
} from "../gql/project";

export default {
  name: "pd-project-item",
  props: {
    id: Number,
    name: String,
    priority: Number,
    refetchQueries: Array,
    inactive: Boolean,
    forceEdit: Boolean,
  },
  data: function () {
    return {
      updateMutation: updateProjectMutation,
      deleteMutation: deleteProjectMutation,
      confirmCancel: false,
      confirmDelete: false,
      editing: this.forceEdit,
      editedName: "",
      editedPriority: "2",
      error: {},
      priorities: [
        { value: "1", text: "high" },
        { value: "2", text: "medium" },
        { value: "3", text: "low" },
      ],
    };
  },
  methods: {
    startEdit: function () {
      this.editedName = this.name;
      this.editedPriority = this.priority ? this.priority.toString() : "2";
      this.editing = true;
      this.$emit("startEdit");
    },
    doneEdit: function () {
      this.editedName = "";
      this.editedPriority = "2";
      this.editing = false;
      this.confirmCancel = false;
      this.confirmDelete = false;
      this.$emit("doneEdit");
    },
    validateAndSubmit: async function (submit) {
      const error = {};
      if (!this.editedName) {
        error.name = "Please provide task name";
      }

      this.error = error;
      if (Object.keys(error).length === 0) {
        submit();
      }
    },
  },
  computed: {
    priorityName: function () {
      const priorityNames = {
        1: "high",
        2: "medium",
        3: "low",
      };
      return priorityNames[this.priority];
    },
    hasError: function() {
      return Object.keys(this.error).length > 0;
    },
    saveProject: function () {
      const values = {
        name: this.editedName,
        priority: this.editedPriority ? Number(this.editedPriority) : undefined,
      };
      return {
        mutation: this.id ? updateProjectMutation : addProjectMutation,
        variables: this.id ? { ...values, id: this.id } : values,
      };
    },
  },
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.priority-field {
  margin-top: 4px;
  align-self: flex-start;

  .v-input__slot,
  .v-input__control {
    min-height: 20px !important;
  }
  .v-select__selections input {
    width: 0;
  }
  .v-select__selection {
    max-width: none;
    margin: 0 !important;
  }
}

.project-name-field {
  .v-input__slot,
  .v-input__control {
    min-height: 32px !important;
  }
}
</style>
<style lang="scss" scoped>
.pd-project-item {
  opacity: 1;
  transition: 0.2s all linear;
  margin: 4px 0;
  align-items: center;
  overflow: hidden;

  &.inactive {
    opacity: 0.2;
  }

  .item-content,
  .extra-content {
    padding: 8px 12px;
  }

  .text-body-1 {
    color: map-get($grey, "darken-3");
  }

  .extra-content {
    box-sizing: border-box;
    padding-left: 32px;
  }

  .expand-icon {
    transition: all 0.2s linear;
  }

  .project-checkbox {
    margin-right: 8px;
  }

  .project-loading {
    margin-left: 2px;
    margin-right: 10px;
  }

  .project-label {
    text-align: left;
    flex: 1;
  }

  .priority-label {
    text-transform: uppercase;
  }

  .project-name {
    color: grey;
  }

  &.high {
    .project-label {
      text-decoration-color: map-get($red, "darken-4");
    }

    .priority-label {
      color: map-get($red, "darken-4");
    }
  }

  &.medium {
    .project-label {
      text-decoration-color: map-get($orange, "darken-4");
    }

    .priority-label {
      color: map-get($orange, "darken-4");
    }
  }

  &.low {
    .project-label {
      text-decoration-color: map-get($green, "darken-4");
    }

    .priority-label {
      color: map-get($green, "darken-4");
    }
  }

  .project-form {
    flex: 1;
  }

  .priority-item {
    font-variant: small-caps;

    &.high {
      color: map-get($red, "lighten-1");
    }

    &.medium {
      color: map-get($orange, "darken-2");
    }

    &.low {
      color: map-get($green, "darken-2");
    }
  }

  .show-error-enter-active,
  .show-error-leave-active,
  .show-extra-enter-active,
  .show-extra-leave-active {
    transition: all 0.2s ease;
    max-height: 100vh;
  }

  .show-error-enter,
  .show-error-leave-to,
  .show-extra-enter,
  .show-extra-leave-to {
    max-height: 0;
    opacity: 0;
  }
}
</style>