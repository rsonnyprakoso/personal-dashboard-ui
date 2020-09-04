<template>
  <!-- <apollo-mutation :mutation="updateMutation" :refetchQueries="refetchQueries">
  <template v-slot="{ mutate: update, loading: updating }">-->
  <apollo-mutation :mutation="deleteMutation" :refetchQueries="refetchQueries">
    <template v-slot="{ mutate: remove, loading: deleting }">
      <v-card dark :class="`pd-target-item ${confirmDelete ? 'with-extra' : ''}`">
        <v-card-text class="item-content text-body-1 d-flex align-center">
          <span>&bull;</span>
          <span class="main-title">
            {{ `${cycleTarget} ${cycleName} ` }}
            <b>{{ name }}</b>
          </span>
          <div class="target-action flex-row align-start">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn icon color="white" small v-on="on" @click="$emit('edit')">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span class="text-body-2">Edit</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn icon color="white" small v-on="on" @click="confirmDelete = true">
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span class="text-body-2">Delete</span>
            </v-tooltip>
          </div>
        </v-card-text>
        <transition appear name="show-extra">
          <v-card-text class="extra-content blue-grey lighten-5" v-if="confirmDelete">
            <div class="d-flex flex-column" v-if="deleting">
              <v-alert small dense class="text-body-2" text color="red">Deleting target...</v-alert>
            </div>
            <div class="d-flex flex-column" v-else>
              <v-alert
                small
                dense
                class="text-body-2"
                text
                color="red"
              >Are you sure you want to delete this target?</v-alert>
              <div class="d-flex">
                <v-btn color="red" text small @click="remove({ variables: { id } })">yes, delete it!</v-btn>
                <v-btn color="primary" text small @click="confirmDelete = false">no, go back</v-btn>
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
  props: ["id", "name", "cycle", "cycleTarget", "refetchQueries"],
  data: function () {
    return {
      updateMutation: updateTargetMutation,
      deleteMutation: deleteTargetMutation,
      confirmDelete: false,
    };
  },
  computed: {
    cycleName: function () {
      const cycleNames = {
        "1": "daily",
        "2": "weekly",
        "3": "monthly",
        "4": "annual",
      };
      return cycleNames[this.cycle];
    },
  },
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.pd-target-item {
  background-color: transparent !important;
  box-shadow: none !important;
  transition: 0.2s all linear;
  margin: 4px 0;
  align-items: center;
  overflow: hidden;

  &:hover, &.with-extra {
    background-color: dimgray !important;
    box-shadow: inherit !important;

    .target-action {
      display: flex;
      flex: 0;
    }

    .item-content {
      padding: 4px 8px;
    }
  }

  .target-action {
    transition: 0.2s all linear;
    display: none;
  }

  .item-content {
    transition: 0.2s all linear;
    justify-content: flex-start;
    padding: 2px 8px;
    color: white !important;

    span {
      text-align: left;
      margin-right: 4px;
      flex: 0;

      &.main-title {
        flex: 1;
        font-weight: 300;

        b {
          font-weight: 500;
        }
      }
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