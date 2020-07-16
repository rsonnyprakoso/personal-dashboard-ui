import gql from 'graphql-tag';

export const projectFragment = gql`
  fragment project on Project {
    id
    name
    priority
    status
  }
`

export const projectNameFragment = gql`
  fragment projectName on Project {
    id
    name
  }
`

export const getAllProjectsQuery = gql`
  query {
    allProjects {
      ...project
    }
  }
  ${projectFragment}
`

export const getAllProjectNamesQuery = gql`
  query {
    allProjects {
      ...projectNames
    }
  }
  ${projectNameFragment}
`