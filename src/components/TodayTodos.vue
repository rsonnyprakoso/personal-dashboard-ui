<template>
  <div class="transition-wrapper">
    <transition name="show-form">
      <div v-if="mode === 'show'" class="show" key="show">
        <apollo-query :query="query" :variables="variables">
          <template v-slot="{ result: { data }, isLoading }">
            <v-progress-circular v-if="isLoading" indeterminate color="white"></v-progress-circular>
            <div v-else class="pd-today-todos d-flex flex-column justify-flex-start">
              <div class="heading text-body-1">Today's focus</div>
              <transition-group appear name="today-list">
                <pd-todo-item
                  v-for="todo in data.allTodos"
                  :key="todo.id"
                  v-bind="todo"
                  :refetchQueries="[{ query, variables }]"
                />
              </transition-group>
              <div class="d-flex justify-space-between">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn @click="mode = 'add'" icon color="white" x-large v-on="on">
                      <v-icon>mdi-plus-box-multiple</v-icon>
                    </v-btn>
                  </template>
                  <span>Add Task</span>
                </v-tooltip>
                <v-btn icon color="white" x-large>
                  <v-icon>mdi-playlist-plus</v-icon>
                </v-btn>
                <v-btn icon color="white" x-large>
                  <v-icon>mdi-format-list-checks</v-icon>
                </v-btn>
              </div>
            </div>
          </template>
        </apollo-query>
      </div>
      <div v-if="mode === 'add'" class="add" key="add">
        <pd-todo-form @close="mode = 'show'" :refetchQueries="[{ query, variables }]" />
      </div>
    </transition>
  </div>
</template>

<script>
import moment from "moment";
import pdTodoItem from "../components/TodoItem";
import pdTodoForm from "../components/TodoForm";
import { getTodayTodosQuery } from "../gql/todo";

export default {
  name: "pd-today-todos",
  components: {
    pdTodoItem,
    pdTodoForm
  },
  data: function() {
    return {
      mode: "show",
      showAddTodo: false,
      query: getTodayTodosQuery,
      variables: { today: moment().format("YYYY-MM-DD") }
    };
  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.transition-wrapper {
  position: relative;
  overflow: hidden;
  flex: 1;
}
.pd-today-todos {
  .today-list-move {
    transition: 0.2s transform;
  }

  .heading {
    text-align: left;
    margin-bottom: 12px;
  }
}

.show,
.add {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.show-form-enter-active,
.show-form-leave-active {
  transition: all 0.2s ease;
}

.show-form-enter.show,
.show-form-leave-to.show {
  transform: translateX(-100%);
}

.show-form-enter.add,
.show-form-leave-to.add {
  transform: translateX(100%);
}
</style>