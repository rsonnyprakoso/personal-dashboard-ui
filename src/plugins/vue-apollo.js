import Vue from 'vue'
import VueApollo from 'vue-apollo'

import ApolloClient from 'apollo-boost'
// Install the vue plugin
Vue.use(VueApollo)

const apolloClient = new ApolloClient({
  // You should use an absolute URL here
  uri: process.env.VUE_APP_GRAPHQL_ENDPOINT
})

export default new VueApollo({
  defaultClient: apolloClient,
})

