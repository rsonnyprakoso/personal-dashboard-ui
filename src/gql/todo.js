import gql from 'graphql-tag';

export const todo = gql`
  fragment todo on Todo {
    id
    name
    isCompleted
    scheduledAt
    priority
  }
`