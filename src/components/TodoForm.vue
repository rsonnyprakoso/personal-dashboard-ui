<template>
  <apollo-mutation
    :mutation="saveTodo.mutation"
    :variables="saveTodo.variables"
    :refetchQueries="refetchQueries"
    @done="$emit('close')"
    @error="error = { any: 'An error occured. Please try again.' }"
  >
    <template v-slot="{ mutate, loading: submitting }">
      <v-card class="todo-form" light>
        <v-card-text>
          <v-text-field
            single-line
            dense
            full-width
            label="Task name"
            v-model="name"
            :error="error.name"
            required
          />
          <apollo-query :query="getProjects.query">
            <template v-slot="{ result: { data }, isLoading }">
              <div class="d-flex align-baseline text-body-2">
                <span>Project</span>
                <v-select
                  placeholder="Project"
                  v-model="project"
                  :items="(data && data.allProjects) || []"
                  :loading="isLoading"
                  :error="error.project"
                  loader-height="2"
                  item-value="id"
                  item-text="name"
                  dense
                  flat
                  solo
                  hide-details="auto"
                  required
                  class="text-body-2"
                >
                  <template slot="item" slot-scope="{ item }">
                    <span class="text-body-2 text-left">{{ item.name }}</span>
                  </template>
                </v-select>
              </div>
            </template>
          </apollo-query>
          <div class="d-flex align-baseline text-body-2">
            <span>Priority</span>
            <v-select
              solo
              flat
              v-model="priority"
              :items="priorities"
              dense
              hide-details="auto"
              class="text-body-2"
            >
              <template slot="selection" slot-scope="{ item }">
                <span :class="'priority-item ' + item.text">{{ item.text }}</span>
              </template>
              <template slot="item" slot-scope="{ item }">
                <span class="priority-item">{{ item.text }}</span>
              </template>
            </v-select>
          </div>

          <div class="d-flex align-baseline text-body-2">
            <span>Scheduled</span>
            <v-select
              :value="scheduledShort"
              :items="scheduledShortOptions"
              :error="error.scheduledOn"
              v-bind="scheduledOn"
              @change="onScheduledShortChanged"
              dense
              flat
              solo
              hide-details="auto"
              required
              light
              class="text-body-2"
            >
              <template slot="selection" v-bind="{ scheduledOn }" slot-scope="{ item }">
                <span
                  class="text-body-2"
                >{{ item.text }} {{ scheduledOn ? `(${toReadableDate(scheduledOn)})` : '' }}</span>
              </template>
              <template slot="item" slot-scope="{ item }">
                <div class="d-flex flex-column align-flex-start schedule-option">
                  <div class="text-left text-body-2">{{ item.text }}</div>
                  <div class="text-caption">{{ toReadableDate(item.subtitle) }}</div>
                </div>
              </template>
            </v-select>
          </div>
          <transition appear name="show">
            <v-date-picker
              v-if="scheduledShort === 'datepicker'"
              full-width
              :disabled="showAlert || submitting"
              no-title
              v-model="scheduledOn"
              show-current
              :min="today"
            />
          </transition>
        </v-card-text>
        <transition appear name="show">
          <v-alert
            v-if="hasError"
            small
            dense
            class="text-body-2"
            text
            color="red"
          >
            <ul>
              <li class="text-left" v-for="errorKey in Object.keys(error)" :key="errorKey">{{ error[errorKey] }}</li>
            </ul>
          </v-alert>
        </transition>
        <transition appear name="show">
          <v-alert
            v-if="showAlert"
            small
            dense
            class="text-body-2"
            text
            color="red"
          >Are you sure you want to cancel? All unsaved data will be cleared!</v-alert>
        </transition>
        <v-card-actions class="blue-grey lighten-5 justify-space-between">
          <v-btn v-if="showAlert" color="red" text small @click="$emit('close')">yes, cancel!</v-btn>
          <v-btn v-else text small @click="showAlert = true">cancel</v-btn>
          <v-btn
            v-if="showAlert"
            color="primary"
            text
            small
            @click="showAlert = false"
          >no, stay here</v-btn>
          <v-btn v-else @click="validateAndSubmit(mutate)" small color="primary" :disabled="loading || submitting">
            <v-progress-circular v-if="submitting" size="16" width="2" indeterminate />
            <span v-else>add task</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </apollo-mutation>
</template>

<script>
import moment from "moment";
import { addTodoMutation, updateTodoMutation } from "../gql/todo";
import { getAllProjectNamesQuery } from "../gql/project";

export default {
  name: "pd-todo-form",
  props: ["id", "task", "refetchQueries"],
  data: function() {
    const today = moment().format("YYYY-MM-DD");
    const tomorrow = moment()
      .add(1, "d")
      .format("YYYY-MM-DD");
    return {
      today,
      tomorrow,
      showAlert: false,
      name: (this.task && this.task.name) || "",
      scheduledOn: (this.task && this.task.scheduledOn) || today,
      project: (this.task && this.task.project) || "",
      priority: (this.task && this.task.priority) || "2",
      getProjects: {
        query: getAllProjectNamesQuery
      },
      error: {},
      rules: {
        name: [v => !!v || "Please fill task name"],
        project: [v => !!v || "Please choose project for this task"],
        scheduledOn: [
          v =>
            v !== "datepicker" ||
            !!this.scheduledOn ||
            "Please choose date from the datepicker"
        ]
      },
      priorities: [
        { value: "1", text: "high" },
        { value: "2", text: "medium" },
        { value: "3", text: "low" }
      ],
      scheduledShortOptions: [
        { text: "Today", subtitle: today, value: today },
        { text: "Tomorrow", subtitle: tomorrow, value: tomorrow },
        {
          text: "Later",
          subtitle: "Select from date picker",
          value: "datepicker"
        }
      ]
    };
  },
  methods: {
    onScheduledShortChanged: function(value) {
      this.scheduledOn = value === "datepicker" ? null : value;
    },
    toReadableDate: function(value) {
      const date = moment(value);
      return date.isValid() ? date.format("DD MMM YYYY") : value;
    },
    validateAndSubmit: async function(submit) {
      const error = {};
      if (!this.name) {
        error.name = "Please provide task name";
      }
      if (!this.project) {
        error.project = "Please choose project for this task";
      }
      if (!this.scheduledOn) {
        error.scheduledOn = "Please choose scheduled date from datepicker";
      }

      this.error = error;
      if (Object.keys(error).length === 0) {
        submit();
      }
    }
  },
  computed: {
    hasError: function() {
      return Object.keys(this.error).length > 0;
    },
    saveTodo: function() {
      const values = {
        name: this.name,
        projectId: this.project,
        scheduledOn: this.scheduledOn,
        priority: this.priority ? Number(this.priority) : undefined
      };
      return {
        mutation: this.id ? updateTodoMutation : addTodoMutation,
        variables: this.id ? { ...values, id: this.id } : values
      };
    },
    scheduledShort: function() {
      if (
        this.scheduledOn === this.today ||
        this.scheduledOn === this.tomorrow
      ) {
        return this.scheduledOn;
      }

      return "datepicker";
    }
  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.v-select__selections input {
  width: 0 !important;
}

.show-enter-active,
.show-leave-active {
  transition: all 0.2s ease;
  max-height: 100vh;
}

.show-enter,
.show-leave-to {
  max-height: 0;
  opacity: 0;
}

.schedule-option div {
  line-height: 1.15em !important;
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
</style>