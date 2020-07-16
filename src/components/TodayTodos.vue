<template>
  <apollo-query :query="query" :variables="variables">
    <template v-slot="{ result: { data }, isLoading }">
      <v-progress-circular v-if="isLoading" indeterminate color="white"></v-progress-circular>
      <div v-else class="pd-today-todos d-flex flex-column justify-flex-start">
        <div class="heading text-body-1">Today's focus</div>
        <transition-group name="today-list">
          <pd-todo-item
            v-for="todo in data.allTodos"
            :key="todo.id"
            v-bind="todo"
            :refetchQueries="[{ query, variables }]"
          />
        </transition-group>
      </div>
    </template>
  </apollo-query>
</template>

<script>
import moment from "moment";
import pdTodoItem from "../components/TodoItem";
import { getTodayTodosQuery } from "../gql/todo";

export default {
  name: "pd-today-todos",
  components: {
    pdTodoItem
  },
  data: function() {
    return {
      query: getTodayTodosQuery,
      variables: { today: moment().format('YYYY-MM-DD') }
    };
  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.pd-today-todos {

  .today-list-move {
    transition: 0.2s transform;
  }

  .heading {
    text-align: left;
    margin-bottom: 12px;
  }
}
</style>