import Vue from 'vue'
import VueApollo from 'vue-apollo'

import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link';
import { RetryLink } from 'apollo-link-retry';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory'
// Install the vue plugin
Vue.use(VueApollo)

const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    new RetryLink(),
    new HttpLink({ uri: process.env.VUE_APP_GRAPHQL_ENDPOINT })
  ]),
  cache: new InMemoryCache()
})

export default new VueApollo({
  defaultClient: apolloClient,
})

