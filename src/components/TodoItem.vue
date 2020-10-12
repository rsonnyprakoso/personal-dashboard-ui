<template>
  <apollo-mutation :mutation="updateMutation" :refetchQueries="refetchQueries">
    <template v-slot="{ mutate: update, loading: updating }">
      <apollo-mutation :mutation="deleteMutation" :refetchQueries="refetchQueries">
        <template v-slot="{ mutate: remove, loading: deleting }">
          <v-card light :class="`pd-todo-item ${priorityName} ${isComplete ? 'checked' : ''}`">
            <v-card-text class="item-content d-flex align-center">
              <v-progress-circular
                class="todo-loading"
                v-if="updating || deleting"
                size="20"
                width="2"
                indeterminate
              />
              <v-simple-checkbox
                off-icon="mdi mdi-radiobox-blank"
                on-icon="mdi mdi-check-circle"
                class="todo-checkbox"
                :value="isComplete"
                v-else
                @input="update({ variables: checkVariables })"
              />
              <div class="todo-label d-flex flex-column align-start">
                <div class="text-body-1">{{ name }}</div>
                <div class="text-caption">
                  <span class="project-name">{{ project.name }}</span>
                  &nbsp;·&nbsp;
                  <small class="priority-label">{{ priorityName }}</small>
                </div>
              </div>
              <v-btn
                :class="'expand-icon ' + (showExtraContent ? 'rotate' : '')"
                @click="showExtraContent = !showExtraContent"
                icon
                color="blue-grey"
                small
              >
                <v-icon>{{ showExtraContent ? 'mdi-dots-vertical-circle' : 'mdi-dots-vertical' }}</v-icon>
              </v-btn>
            </v-card-text>
            <transition appear name="show-extra">
              <v-card-text class="extra-content blue-grey lighten-5" v-if="showExtraContent">
                <div class="d-flex flex-column" v-if="confirmDelete">
                  <v-alert
                    small
                    dense
                    class="text-body-2"
                    text
                    color="red"
                  >Are you sure you want to delete this task?</v-alert>
                  <div class="d-flex">
                    <v-btn
                      color="red"
                      text
                      small
                      @click="remove({ variables: { id } })"
                    >yes, delete it!</v-btn>
                    <v-btn color="primary" text small @click="confirmDelete = false">no, go back</v-btn>
                  </div>
                </div>
                <div class="d-flex align-flex-start" v-else>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn icon color="primary" small v-on="on" @click="$emit('edit')">
                        <v-icon small>mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    <span class="text-body-2">Edit</span>
                  </v-tooltip>
                  <!-- <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn icon color="primary" small v-on="on">
                    <v-icon small>mdi-playlist-plus</v-icon>
                  </v-btn>
                </template>
                <span class="text-body-2">Add Subtask</span>
                  </v-tooltip>-->
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        icon
                        color="primary"
                        small
                        v-on="on"
                        @click="update({ variables: doTomorrowVariables })"
                      >
                        <v-icon small>mdi-calendar-arrow-right</v-icon>
                      </v-btn>
                    </template>
                    <span class="text-body-2">Do It Tomorrow</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn icon color="error" small v-on="on" @click="confirmDelete = true">
                        <v-icon small>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                    <span class="text-body-2">Delete</span>
                  </v-tooltip>
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
import { updateTodoPartialMutation, deleteTodoMutation } from "../gql/todo";

export default {
  name: "pd-todo-item",
  props: ["id", "name", "isComplete", "project", "priority", "refetchQueries"],
  data: function () {
    return {
      updateMutation: updateTodoPartialMutation,
      deleteMutation: deleteTodoMutation,
      showExtraContent: false,
      confirmDelete: false,
    };
  },
  computed: {
    priorityName: function () {
      const priorityNames = {
        "1": "high",
        "2": "medium",
        "3": "low",
      };
      return priorityNames[this.priority];
    },
    checkVariables: function () {
      return {
        id: this.id,
        isComplete: !this.isComplete,
      };
    },
    doTomorrowVariables: function () {
      const tomorrow = moment().add(1, "d").format("YYYY-MM-DD");
      return {
        id: this.id,
        scheduledOn: tomorrow,
      };
    },
  },
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.pd-todo-item {
  opacity: 0.9;
  transition: 0.2s all linear;
  margin: 4px 0;
  align-items: center;
  overflow: hidden;

  &.checked {
    opacity: 0.5;

    .todo-label {
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

  .todo-checkbox {
    margin-right: 8px;
  }

  .todo-loading {
    margin-left: 2px;
    margin-right: 10px;
  }

  .todo-label {
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
    .todo-checkbox i,
    .todo-loading {
      color: map-get($red, "lighten-1");
    }

    .todo-label {
      text-decoration-color: map-get($red, "darken-4");
    }

    .priority-label {
      color: map-get($red, "darken-4");
    }
  }

  &.medium {
    .todo-checkbox i,
    .todo-loading {
      color: map-get($orange, "darken-2");
    }

    .todo-label {
      text-decoration-color: map-get($orange, "darken-4");
    }

    .priority-label {
      color: map-get($orange, "darken-4");
    }
  }

  &.low {
    .todo-checkbox i,
    .todo-loading {
      color: map-get($green, "darken-2");
    }

    .todo-label {
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