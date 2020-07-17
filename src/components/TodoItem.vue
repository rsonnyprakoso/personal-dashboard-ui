<template>
  <apollo-mutation :mutation="mutation" :variables="variables" :refetchQueries="refetchQueries">
    <template v-slot="{ mutate }">
      <v-card light :class="`pd-todo-item d-flex ${priorityName} ${isComplete ? 'checked' : ''}`">
        <v-simple-checkbox
          off-icon="radio_button_unchecked"
          on-icon="check_circle"
          class="todo-checkbox"
          :value="isComplete"
          @input="mutate"
        />
        <div class="todo-label d-flex flex-column align-start">
          <div class="text-body-1">{{ name }}</div>
          <div class="text-caption">
            <span class="project-name">{{ project.name }}</span>
            &nbsp;·&nbsp;
            <small class="priority-label">{{ priorityName }}</small>
          </div>
        </div>
      </v-card>
    </template>
  </apollo-mutation>
</template>

<script>
import { updateTodoMutation } from "../gql/todo";

export default {
  name: "pd-todo-item",
  props: ["id", "name", "isComplete", "project", "priority", "refetchQueries"],
  data: function() {
    return {
      mutation: updateTodoMutation,
    };
  },
  computed: {
    priorityName: function() {
      const priorityNames = {
        '1': 'high',
        '2': 'medium',
        '3': 'low'
      }
      return priorityNames[this.priority];
    },
    variables: function() {
      return {
        id: this.id,
        name: this.name,
        priority: this.priority,
        projectId: this.project.id,
        isComplete: !this.isComplete
      };
    }
  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.pd-todo-item {
  opacity: 1;
  transition: 0.2s all linear;
  margin: 4px 0;
  padding: 8px;

  &.checked {
    opacity: 0.5;

    .todo-label {
      text-decoration: line-through;
    }
  }

  .todo-checkbox {
    margin-right: 8px;
  }

  .todo-label {
    text-align: left;
  }

  .priority-label {
    text-transform: uppercase;
  }

  .project-name {
    color: map-get($blue-grey, "lighten-1");
  }

  &.high {
    .todo-checkbox i {
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
    .todo-checkbox i {
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
    .todo-checkbox i {
      color: map-get($green, "darken-2");
    }

    .todo-label {
      text-decoration-color: map-get($green, "darken-4");
    }

    .priority-label {
      color: map-get($green, "darken-4");
    }
  }
}
</style>