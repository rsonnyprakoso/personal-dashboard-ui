<template>
  <apollo-mutation :mutation="deleteMutation" :refetchQueries="refetchQueries">
    <template v-slot="{ mutate: remove, loading: deleting }">
      <v-card
        light
        :class="`pd-target-item ${confirmDelete ? 'with-extra' : ''}`"
        elevation="1"
      >
        <v-card-text class="item-content d-flex align-items-center">
          <v-progress-circular
            :rotate="-90"
            :value="completion"
            :color="completionColor"
            size="40"
          >
            <b class="text-caption">{{ `${count}/${cycleTarget}` }}</b>
          </v-progress-circular>
          <div class="item-text d-flex align-flex-start">
            <span class="text-body-1">{{ name }}</span>
            <div class="d-flex justify-space-between align-end">
              <span class="text-caption">{{ cycleName }}</span>
              <apollo-mutation
                :mutation="addTargetCountMutation"
                :refetchQueries="refetchQueries"
              >
                <template v-slot="{ mutate: addCount, loading: addingCount }">
                  <div class="target-action flex-row align-start">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          icon
                          class="bottom-icon"
                          small
                          v-on="on"
                          :disabled="addingCount"
                          @click="addCount({ variables: { targetId: id } })"
                        >
                          <v-icon small>mdi-plus</v-icon>
                        </v-btn>
                      </template>
                      <span class="text-caption">Add count</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          icon
                          class="bottom-icon"
                          small
                          v-on="on"
                          :disabled="addingCount"
                          @click="$emit('edit')"
                        >
                          <v-icon small>mdi-pencil</v-icon>
                        </v-btn>
                      </template>
                      <span class="text-caption">Edit</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          icon
                          class="bottom-icon"
                          small
                          v-on="on"
                          :disabled="addingCount"
                          @click="confirmDelete = true"
                        >
                          <v-icon small>mdi-delete</v-icon>
                        </v-btn>
                      </template>
                      <span class="text-caption">Delete</span>
                    </v-tooltip>
                  </div>
                </template>
              </apollo-mutation>
            </div>
          </div>
        </v-card-text>
        <transition appear name="show-extra">
          <v-card-text
            class="extra-content blue-grey lighten-5"
            v-if="confirmDelete"
          >
            <div class="d-flex flex-column" v-if="deleting">
              <v-alert small dense class="text-body-2" text color="red"
                >Deleting target...</v-alert
              >
            </div>
            <div class="d-flex flex-column" v-else>
              <v-alert small dense class="text-body-2" text color="red"
                >Are you sure you want to delete this target?</v-alert
              >
              <div class="d-flex">
                <v-btn
                  color="red"
                  text
                  small
                  @click="remove({ variables: { id } })"
                  >yes, delete it!</v-btn
                >
                <v-btn color="primary" text small @click="confirmDelete = false"
                  >no, go back</v-btn
                >
              </div>
            </div>
          </v-card-text>
        </transition>
      </v-card>
    </template>
  </apollo-mutation>
  <!-- </template>
  </apollo-mutation>-->
</template>

<script>
import {
  updateTargetMutation,
  deleteTargetMutation,
  addTargetDoneMutation,
} from "../gql/target";

export default {
  name: "pd-target-item",
  props: [
    "id",
    "name",
    "cycle",
    "cycleTarget",
    "_targetDoneListMeta",
    "refetchQueries",
  ],
  data: function () {
    return {
      updateMutation: updateTargetMutation,
      deleteMutation: deleteTargetMutation,
      addTargetCountMutation: addTargetDoneMutation,
      confirmDelete: false,
    };
  },
  computed: {
    count: function () {
      return (this._targetDoneListMeta && this._targetDoneListMeta.count) || 0;
    },
    completion: function () {
      return (this.count / this.cycleTarget) * 100 || 1;
    },
    completionColor: function () {
      if (this.completion >= 100) {
        return "green";
      }
      if (this.completion < 50 && this.cycleTarget > 1) {
        return "red";
      }
      return "orange";
    },
    cycleName: function () {
      const cycleNames = {
        1: "Daily",
        2: "Weekly",
        3: "Monthly",
        4: "Annual",
      };
      return cycleNames[this.cycle];
    },
  },
};
</script>

<style lang="scss">
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.pd-target-item {
  box-shadow: none !important;
  align-items: center;
  overflow: hidden;
  margin: 4px 0;

  &:hover,
  &.with-extra {
    box-shadow: inherit !important;
  }

  .target-action {
    display: flex;
    flex: 0;
  }

  .item-content {
    padding: 8px;

    .item-text {
      flex: 1;
      flex-direction: column;
      padding-left: 12px;
    }

    span {
      text-align: left;
      margin-right: 4px;
      flex: 0;

      &.text-body-1 {
        color: map-get($grey, "darken-3");
      }

      &.text-caption {
        color: grey;
      }
    }
  }

  .bottom-icon.v-btn--icon {
    height: 24px;
    width: 24px;
    opacity: 0.5;

    &:hover {
      opacity: 1;
    }

    .v-btn__content .v-icon {
      height: 24px;
      width: 24px;
      font-size: 14px !important;
    }
  }

  .extra-content {
    box-sizing: border-box;
    padding: 8px;
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