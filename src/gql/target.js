import gql from 'graphql-tag';

export const targetFragment = gql`
  fragment target on Target {
    id
    name
    cycle
    cycleTarget
  }
`

export const getAllTargetsQuery = gql`
  query {
    allTargets(
      sortBy: [cycle_ASC, cycleTarget_DESC]
    ) {
      ...target
    }
  }
  ${targetFragment}
`

export const addTargetMutation = gql`
  mutation(
    $name: String!
    $cycle: String!
    $cycleTarget: Int!
  ) {
    createTarget(
      data: {
        name: $name
        cycle: $cycle
        cycleTarget: $cycleTarget
      }
    )
  }
`
export const updateTargetMutation = gql`
  mutation(
    $id: ID!
    $name: String!
    $cycle: String!
    $cycleTarget: Int!
  ) {
    updateTarget(
      id: $id
      data: {
        name: $name
        cycle: $cycle
        cycleTarget: $cycleTarget
      }
    )
  }
`

export const deleteTargetMutation = gql`
  mutation($id: ID!) {
    deleteTarget(id: $id) {
      id
    }
  }
`
