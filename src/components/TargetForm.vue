<template>
  <apollo-mutation
    :mutation="saveTarget.mutation"
    :variables="saveTarget.variables"
    :refetchQueries="refetchQueries"
    @done="cancelForm"
    @error="error = { any: 'An error occured. Please try again.' }"
  >
    <template v-slot="{ mutate, loading: submitting }">
      <v-card class="target-form" light>
        <v-card-text>
          <v-text-field
            single-line
            dense
            full-width
            label="Target name"
            v-model="name"
            :error="error.name"
            required
          />
          <div class="d-flex align-baseline text-body-2">
            <span>Cycle</span>
            <v-select
              solo
              flat
              v-model="cycle"
              :items="cycles"
              dense
              hide-details="auto"
              class="text-body-2"
            >
              <template slot="selection" slot-scope="{ item }">
                <span :class="'cycle-item ' + item.text">{{ item.text }}</span>
              </template>
              <template slot="item" slot-scope="{ item }">
                <span class="cycle-item">{{ item.text }}</span>
              </template>
            </v-select>
          </div>
          <div class="d-flex justify-flex-start align-flex-start">
            <div class="text-body-2 cycle-target-label">Target per cycle</div>
            <v-slider
              class="text-caption"
              min="1"
              max="5"
              step="1"
              persistent-hint
              v-model="cycleTarget"
              dense
              :tick-labels="[1, 2, 3, 4, 5]"
              ticks="always"
            />
          </div>
        </v-card-text>
        <transition appear name="show">
          <v-alert v-if="hasError" small dense class="text-body-2" text color="red">
            <ul>
              <li
                class="text-left"
                v-for="errorKey in Object.keys(error)"
                :key="errorKey"
              >{{ error[errorKey] }}</li>
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
          <v-btn v-if="showAlert" color="red" text small @click="cancelForm">yes, cancel!</v-btn>
          <v-btn v-else text small @click="showAlert = true">cancel</v-btn>
          <v-btn
            v-if="showAlert"
            color="primary"
            text
            small
            @click="showAlert = false"
          >no, stay here</v-btn>
          <v-btn
            v-else
            @click="validateAndSubmit(mutate)"
            small
            color="primary"
            :disabled="submitting"
          >
            <v-progress-circular v-if="submitting" size="16" width="2" indeterminate />
            <span v-else>
              {{ !!id ? 'Edit Target' : 'Add Target' }}
            </span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </apollo-mutation>
</template>

<script>
import { addTargetMutation, updateTargetMutation } from "../gql/target";

export default {
  name: "pd-target-form",
  props: ["target", "refetchQueries"],
  data: function () {
    return {
      showAlert: false,
      id: (this.target && this.target.id) || "",
      name: (this.target && this.target.name) || "",
      cycle:
        this.target && this.target.cycle ? this.target.cycle.toString() : "2",
      cycleTarget: (this.target && this.target.cycleTarget) || 1,
      error: {},
      rules: {
        name: [(v) => !!v || "Please fill target name"],
      },
      cycles: [
        { value: "1", text: "Daily" },
        { value: "2", text: "Weekly" },
        { value: "3", text: "Monthly" },
        { value: "4", text: "Annual" },
      ],
    };
  },
  methods: {
    validateAndSubmit: async function (submit) {
      const error = {};
      if (!this.name) {
        error.name = "Please provide target name";
      }

      this.error = error;
      if (Object.keys(error).length === 0) {
        submit();
      }
    },
    cancelForm: function () {
      this.showAlert = false;
      this.$emit('close')
    }
  },
  computed: {
    hasError: function () {
      return Object.keys(this.error).length > 0;
    },
    saveTarget: function () {
      const values = {
        name: this.name,
        cycleTarget: this.cycleTarget,
        cycle: this.cycle ? Number(this.cycle) : undefined,
      };
      return {
        mutation: this.id ? updateTargetMutation : addTargetMutation,
        variables: this.id ? { ...values, id: this.id } : values,
      };
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.v-select__selections input {
  width: 0 !important;
}

.cycle-target-label {
  padding-top: 4px;
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

.priority-item {
  font-variant: small-caps;
}
</style>