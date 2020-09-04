<template>
  <div class="transition-wrapper">
    <transition name="show-form">
      <div v-if="mode === 'list'" class="list" key="list">
        <apollo-query :query="query">
          <template v-slot="{ result: { data }, isLoading }">
            <v-progress-circular v-if="isLoading" indeterminate color="white"></v-progress-circular>
            <div v-else class="pd-targets d-flex flex-column justify-flex-start">
              <div class="heading text-body-1">Your targets</div>
              <pd-target-item
                v-for="target in data.allTargets"
                :key="target.id"
                v-bind="target"
                :refetchQueries="[{ query }]"
                @edit="startEdit(target)"
              />
            </div>
          </template>
        </apollo-query>
      </div>
      <div v-if="mode === 'form'" class="form" key="form">
        <pd-target-form
          :target="targetToEdit"
          @close="closeForm"
          :refetchQueries="[{ query }]"
        />
      </div>
    </transition>
  </div>
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
      mode: "list",
      query: getAllTargetsQuery,
      targetToEdit: null,
    };
  },
  methods: {
    startEdit: function (target) {
      (this.mode = "form"), (this.targetToEdit = target);
    },
    closeForm: function () {
      (this.mode = "list"), (this.targetToEdit = null);
    },
  },
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.transition-wrapper {
  position: relative;
  overflow: hidden;
  flex: 1;
}
.pd-targets {
  .heading {
    text-align: left;
    margin-bottom: 12px;
  }
}

.list,
.form {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
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