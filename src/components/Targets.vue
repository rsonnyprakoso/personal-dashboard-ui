<template>
  <apollo-query :query="query">
    <template v-slot="{ result: { data }, isLoading }">
      <v-progress-circular
        v-if="isLoading"
        indeterminate
        color="white"
      ></v-progress-circular>
      <div v-else :class="`pd-targets ${showForm ? 'blur' : ''} d-flex flex-column justify-flex-start`">
        <div class="heading text-body-1">Your targets</div>
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
            :target="targetToEdit"
            @close="closeForm"
            :refetchQueries="[{ query }]"
          />
        </v-menu>
      </div>
    </template>
  </apollo-query>
</template>

<script>
import pdTargetItem from "../components/TargetItem";
import pdTargetForm from "../components/TargetForm";
import { getAllTargetsQuery } from "../gql/target";

export default {
  name: "pd-targets",
  components: {
    pdTargetItem,
    pdTargetForm,
  },
  data: function () {
    return {
      showForm: false,
      query: getAllTargetsQuery,
      targetToEdit: null,
    };
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