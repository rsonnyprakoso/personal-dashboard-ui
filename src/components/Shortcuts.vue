<template>
  <apollo-query :query="query">
    <template v-slot="{ result: { data }, isLoading }">
      <v-progress-circular v-if="isLoading" indeterminate color="white"></v-progress-circular>
      <div v-else class="pd-shortcuts d-flex justify-flex-start">
        <v-tooltip v-for="shortcut in data.allShortcuts" :key="shortcut.name" top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              color="white"
              v-bind="attrs"
              v-on="on"
              :href="shortcut.url"
              target="_blank"
              rel="noopener noreferrer"
              x-large
            >
              <v-icon>{{ shortcut.icon }}</v-icon>
            </v-btn>
          </template>
          <span>{{ shortcut.name }}</span>
        </v-tooltip>
      </div>
    </template>
  </apollo-query>
</template>

<script>
import { getAllShortcutsQuery } from "../gql/shortcut";

export default {
  name: "pd-shortcuts",
  data: function() {
    return {
      query: getAllShortcutsQuery
    };
  }
};
</script>
