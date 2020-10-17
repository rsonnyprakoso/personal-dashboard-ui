<template>
  <apollo-query :query="query" :variables="variables">
    <template v-slot="{ result: { data }, isLoading }">
      <v-progress-circular
        v-if="isLoading"
        indeterminate
        color="white"
      ></v-progress-circular>
      <div v-else class="pd-todos d-flex flex-column justify-flex-start">
        <transition-group appear name="today-list">
          <pd-todo-item
            v-for="todo in data.allTodos"
            :key="todo.id"
            v-bind="todo"
            :refetchQueries="[{ query, variables }]"
            @edit="startEdit(todo)"
          />
        </transition-group>
        <v-menu
          v-model="showForm"
          :close-on-content-click="false"
          absolute
          attach=".right-side"
          max-width="100%"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="mode = 'form'"
              class="add-button text-body-1"
              text
              color="white"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon small>mdi-plus</v-icon>
              <span>Add Task</span>
            </v-btn>
          </template>
          <pd-todo-form
            :task="taskToEdit"
            @close="closeForm"
            :refetchQueries="[{ query, variables }]"
          />
        </v-menu>
      </div>
    </template>
  </apollo-query>
</template>

<script>
import moment from "moment";
import pdTodoItem from "../components/TodoItem";
import pdTodoForm from "../components/TodoForm";
import { getTodayTodosQuery } from "../gql/todo";

export default {
  name: "pd-todos",
  components: {
    pdTodoItem,
    pdTodoForm,
  },
  data: function () {
    return {
      query: getTodayTodosQuery,
      showForm: false,
      taskToEdit: null,
      variables: { today: moment().format("YYYY-MM-DD") },
    };
  },
  methods: {
    startEdit: function (task) {
      this.showForm = true;
      this.taskToEdit = task;
    },
    closeForm: function () {
      this.showForm = false;
      this.taskToEdit = null;
    },
  },
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.pd-todos {
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

.show-form-enter-active,
.show-form-leave-active {
  transition: all 0.2s ease;
}

.show-form-enter.list,
.show-form-leave-to.list {
  transform: translateX(-100%);
}

.show-form-enter.form,
.show-form-leave-to.form {
  transform: translateX(100%);
}
</style>