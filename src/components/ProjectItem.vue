<template>
  <apollo-mutation 
    :mutation="saveTarget.mutation"
    :variables="saveTarget.variables"
    :refetchQueries="refetchQueries"
    @done="doneEdit()"
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
            }`"
          >
            <v-card-text
              v-if="mode === 'view'"
              class="item-content d-flex align-center"
            >
              <div class="project-label d-flex flex-column align-start">
                <div class="text-body-1">{{ name }}</div>
                <small class="text-caption priority-label">{{
                  priorityName
                }}</small>
              </div>
              <div class="d-flex align-flex-start">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      color="primary"
                      small
                      v-on="on"
                      @click="$emit('edit')"
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
                    >
                      <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span class="text-body-2">Delete</span>
                </v-tooltip>
              </div>
            </v-card-text>
            <v-card-text
              v-if="mode === 'edit'"
              class="item-content d-flex align-center"
            >
              <div class="project-label d-flex flex-column align-start">
                <v-text-field
                  single-line
                  dense
                  full-width
                  label="Project name"
                  class="text-body-2"
                  v-model="editedName"
                  :error="error.name"
                  required
                />
                <div class="d-flex align-baseline text-body-2">
                  <span>Priority</span>
                  <v-select
                    solo
                    flat
                    v-model="editedPriority"
                    :items="priorities"
                    dense
                    hide-details="auto"
                    class="text-caption"
                  >
                    <template slot="selection" slot-scope="{ item }">
                      <span :class="'priority-item ' + item.text">{{
                        item.text
                      }}</span>
                    </template>
                    <template slot="item" slot-scope="{ item }">
                      <span class="priority-item">{{ item.text }}</span>
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
                      @click="submit({ variables: { id, name: editedName, priority: editedPriority } })"
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
                      @click="confirmDelete = true"
                    >
                      <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span class="text-body-2">Delete</span>
                </v-tooltip>
              </div>
            </v-card-text>
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
              <v-card-text
                class="extra-content blue-grey lighten-5"
                v-if="confirmCancel"
              >
                <div class="d-flex flex-column">
                  <v-alert small dense class="text-body-2" text color="red"
                    >Are you sure you want to cancel? All unsaved data will be cleared!</v-alert
                  >
                  <div class="d-flex">
                    <v-btn color="red" text small @click="doneEdit()">yes, cancel!</v-btn>
                    <v-btn
                      color="primary"
                      text
                      small
                      @click="confirmCancel = false"
                      >no, stay here</v-btn
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
import moment from "moment";
import { updateprojectPartialMutation, deleteprojectMutation } from "../gql/project";

export default {
  name: "pd-project-item",
  props: ["id", "name", "priority", "refetchQueries"],
  data: function () {
    return {
      mode: "view",
      updateMutation: updateprojectPartialMutation,
      deleteMutation: deleteprojectMutation,
      confirmCancel: false,
      confirmDelete: false,
      editedName: "",
      editedPriority: "",
      priorities: [
        { value: "1", text: "high" },
        { value: "2", text: "medium" },
        { value: "3", text: "low" }
      ]
    };
  },
  methods: {
    startEdit: function () {
      this.editedName = this.name;
      this.editedPriority = this.priority;
      this.mode = "edit";
      this.$emit('startEdit', this.id);
    },
    doneEdit: function () {
      this.editedName = "";
      this.editedPriority = "";
      this.mode = "view";
      this.$emit('doneEdit');
    },
  },
  computed: {
    priorityName: function () {
      const selectedPriority = this.priorities.find(p => p.value === this.priority);
      return (selectedPriority && selectedPriority.name) || '';
    },
    saveProject: function () {
      const values = {
        name: this.editedName,
        priority: this.editedPriority
      };
      return {
        mutation: this.id ? updateTargetMutation : addTargetMutation,
        variables: this.id ? { ...values, id: this.id } : values,
      };
    },
  },
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.pd-project-item {
  opacity: 0.9;
  transition: 0.2s all linear;
  margin: 4px 0;
  align-items: center;
  overflow: hidden;

  &.checked {
    opacity: 0.5;

    .project-label {
      text-decoration: line-through;
    }
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
    .project-checkbox i,
    .project-loading {
      color: map-get($red, "lighten-1");
    }

    .project-label {
      text-decoration-color: map-get($red, "darken-4");
    }

    .priority-label {
      color: map-get($red, "darken-4");
    }
  }

  &.medium {
    .project-checkbox i,
    .project-loading {
      color: map-get($orange, "darken-2");
    }

    .project-label {
      text-decoration-color: map-get($orange, "darken-4");
    }

    .priority-label {
      color: map-get($orange, "darken-4");
    }
  }

  &.low {
    .project-checkbox i,
    .project-loading {
      color: map-get($green, "darken-2");
    }

    .project-label {
      text-decoration-color: map-get($green, "darken-4");
    }

    .priority-label {
      color: map-get($green, "darken-4");
    }
  }

  .show-extra-enter-active,
  .show-extra-leave-active {
    transition: all 0.2s ease;
    max-height: 100vh;
  }

  .show-extra-enter,
  .show-extra-leave-to {
    max-height: 0;
    padding: 0;
    padding-left: 32px;
  }
}
</style>