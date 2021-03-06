import gql from 'graphql-tag';
import { projectNameFragment } from './project';

export const todoFragment = gql`
  fragment todo on Todo {
    id
    name
    isComplete
    scheduledOn
    priority
    project {
      ...projectName
    }
  }
  ${projectNameFragment}
`
export const getAllTodosQuery = gql`
  query {
    allTodos {
      ...todo
    }
  }
  ${todoFragment}
`
export const getTodayTodosQuery = gql`
  query($today: String) {
    allTodos(
      where: { scheduledOn: $today }
      sortBy: [isComplete_ASC, priority_ASC, name_ASC]
    ) {
      ...todo
    }
  }
  ${todoFragment}
`

export const addTodoMutation = gql`
  mutation(
    $name: String!
    $scheduledOn: String!
    $priority: Int!
    $projectId: ID!
  ) {
    createTodo(
      data: {
        name: $name
        scheduledOn: $scheduledOn
        priority: $priority
        project: { connect: { id: $projectId } }
      }
    ) {
      ...todo
    }
  }
  ${todoFragment}
`
export const updateTodoMutation = gql`
  mutation(
    $id: ID!
    $name: String
    $scheduledOn: String
    $isComplete: Boolean
    $priority: Int
    $projectId: ID!
  ) {
    updateTodo(
      id: $id
      data: {
        name: $name
        scheduledOn: $scheduledOn
        priority: $priority
        isComplete: $isComplete
        project: { connect: { id: $projectId } }
      }
    ) {
      ...todo
    }
  }
  ${todoFragment}
`
export const updateTodoPartialMutation = gql`
  mutation(
    $id: ID!
    $scheduledOn: String
    $isComplete: Boolean
    $priority: Int
  ) {
    updateTodo(
      id: $id
      data: {
        scheduledOn: $scheduledOn
        priority: $priority
        isComplete: $isComplete
      }
    ) {
      ...todo
    }
  }
  ${todoFragment}
`

export const deleteTodoMutation = gql`
  mutation($id: ID!) {
    deleteTodo(id: $id) {
      id
    }
  }
`
