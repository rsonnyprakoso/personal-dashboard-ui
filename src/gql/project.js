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
    allProjects(
      sortBy: [priority_ASC, name_ASC]
    ) {
      ...project
    }
  }
  ${projectFragment}
`

export const getAllProjectNamesQuery = gql`
  query {
    allProjects(sortBy: name_ASC) {
      ...projectName
    }
  }
  ${projectNameFragment}
`

export const addProjectMutation = gql`
  mutation(
    $name: String!
    $priority: Int!
  ) {
    createProject(
      data: {
        name: $name
        priority: $priority
      }
    ) {
      ...project
    }
  }
  ${projectFragment}
`

export const updateProjectMutation = gql`
  mutation(
    $id: ID!
    $name: String!
    $priority: Int!
  ) {
    updateProject(
      id: $id
      data: {
        name: $name
        priority: $priority
      }
    ) {
      ...project
    }
  }
  ${projectFragment}
`

export const deleteProjectMutation = gql`
  mutation($id: ID!) {
    deleteProject(id: $id) {
      id
    }
  }
`