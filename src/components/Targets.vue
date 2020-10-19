<template>
  <div :class="`pd-targets ${showForm ? 'blur' : ''}`">
    <div class="heading d-flex align-baseline text-body-1">
      Your
      <b><u>
        <v-select
          :items="cycles"
          v-model="selectedCycle"
          class="cycle-select"
          solo
          flat
          background-color="transparent"
          dense
          hide-details
        />
      </u></b>
      targets
    </div>
    <apollo-query :query="query" :variables="variables">
      <template v-slot="{ result: { data }, isLoading }">
        <v-progress-circular
          v-if="isLoading"
          indeterminate
          color="white"
        ></v-progress-circular>
        <div
          :key="selectedCycle"
          v-else
          class="d-flex flex-column justify-flex-start"
        >
          <pd-target-item
            v-bind="target"
            v-for="target in data.allTargets"
            :key="target.id"
            :refetchQueries="[{ query }]"
            @edit="startEdit(target)"
          />
          <v-menu
            v-model="showForm"
            :close-on-content-click="false"
            absolute
            attach=".right-side"
            max-width="100%"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="add-button text-body-1"
                text
                color="white"
                v-on="on"
                v-bind="attrs"
              >
                <v-icon small>mdi-plus</v-icon>
                <span>Add Target</span>
              </v-btn>
            </template>
            <pd-target-form
              :key="(targetToEdit && targetToEdit.id) || Date.now()"
              :target="targetToEdit"
              @close="closeForm"
              :refetchQueries="[{ query }]"
            />
          </v-menu>
        </div>
      </template>
    </apollo-query>
  </div>
</template>

<script>
import moment from "moment";
import pdTargetItem from "../components/TargetItem";
import pdTargetForm from "../components/TargetForm";
import { getTargetsByCycleQuery } from "../gql/target";

export default {
  name: "pd-targets",
  components: {
    pdTargetItem,
    pdTargetForm,
  },
  data: function () {
    return {
      showForm: false,
      query: getTargetsByCycleQuery,
      selectedCycle: 2,
      cycles: [
        { text: "daily", value: 1, timestamp: "day" },
        { text: "weekly", value: 2, timestamp: "week" },
        { text: "monthly", value: 3, timestamp: "month" },
        { text: "annual", value: 4, timestamp: "year" },
      ],
      targetToEdit: null,
    };
  },
  computed: {
    variables: function () {
      const today = moment();
      const currentCycle = this.cycles.find(
        (cycle) => cycle.value === this.selectedCycle
      );
      const timestamp = (currentCycle && currentCycle.timestamp) || "week";

      return {
        cycle: this.selectedCycle,
        startDate: today.startOf(timestamp),
        endDate: today.endOf(timestamp),
      };
    },
  },
  methods: {
    startEdit: function (target) {
      this.showForm = true;
      this.targetToEdit = target;
    },
    closeForm: function () {
      this.showForm = false;
      this.targetToEdit = null;
    },
  },
};
</script>

<style lang="scss">
.cycle-select {
  .v-input__slot { padding: 0 6px !important; margin: 0 }
  .v-select__selections input { width: 0 }
  .v-input__append-inner { display: none }
  .v-select__selection {
    max-width: none;
    margin: 0 !important
  }
}

.target-carousel {
  .v-window__container {
    .v-window__prev,
    .v-window__next {
      top: 20px;
      margin: 0 2px;
      line-height: 1;
      background-color: transparent;

      .v-btn--icon {
        height: 20px;
        width: 20px;

        .v-btn__content .v-icon {
          height: 20px;
          width: 20px;
          font-size: 20px !important;
        }
      }
    }
  }
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.pd-targets {
  opacity: 1;
  transition: opacity 0.5s;

  &.blur {
    opacity: 0.2;
  }

  .heading {
    text-align: left;
    margin-bottom: 20px;
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
  font-weight: 600;
}
</style>