import gql from 'graphql-tag';

export const project = gql`
  fragment project on Project {
    id
    name
    priority
    status
  }
`

export const projectName = gql`
  fragment projectName on Project {
    id
    name
  }
`