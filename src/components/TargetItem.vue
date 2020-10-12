<template>
  <!-- <apollo-mutation :mutation="updateMutation" :refetchQueries="refetchQueries">
  <template v-slot="{ mutate: update, loading: updating }">-->
  <apollo-mutation :mutation="deleteMutation" :refetchQueries="refetchQueries">
    <template v-slot="{ mutate: remove, loading: deleting }">
      <v-card
        light
        :class="`pd-target-item ${confirmDelete ? 'with-extra' : ''}`"
      >
        <v-card-text class="item-content d-flex">
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
            <span class="text-caption">{{ cycleName }}</span>
            <div class="target-action flex-row align-start">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    class="bottom-icon"
                    small
                    v-on="on"
                    @click="$emit('next')"
                  >
                    <v-icon small>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <span class="text-caption">Done one</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    class="bottom-icon"
                    small
                    v-on="on"
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
                    @click="confirmDelete = true"
                  >
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                </template>
                <span class="text-caption">Delete</span>
              </v-tooltip>
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
import { updateTargetMutation, deleteTargetMutation } from "../gql/target";

export default {
  name: "pd-target-item",
  props: [
    "id",
    "name",
    "cycle",
    "cycleTarget",
    "refetchQueries",
    "_targetDoneListMeta",
  ],
  data: function () {
    return {
      updateMutation: updateTargetMutation,
      deleteMutation: deleteTargetMutation,
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
  opacity: 0.9;
  box-shadow: none !important;
  align-items: center;
  overflow: hidden;

  &:hover,
  &.with-extra {
    box-shadow: inherit !important;
  }

  .target-action {
    display: flex;
    flex: 0;
    margin: 0 -8px;
  }

  .item-content {
    padding: 8px 24px;

    .item-text {
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
    margin-right: 8px;

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