import gql from 'graphql-tag';

export const targetFragment = gql`
  fragment target on Target {
    id
    name
    cycle
    cycleTarget
  }
`

export const targetDoneFragment = gql`
  fragment targetDone on TargetDone {
    id
    doneAt
    target {
      ...target
    }
  }
  ${targetFragment}
`

export const getAllTargetsQuery = gql`
  query {
    allTargets(
      sortBy: [cycle_ASC, cycleTarget_DESC, name_ASC]
    ) {
      ...target
      _targetDoneListMeta {
        count
      }
      targetDoneList {
        id
        doneAt
      }
    }
  }
  ${targetFragment}
`

export const getTargetsByCycleQuery = gql`
  query(
    $cycle: Int!
    $startDate: DateTime
    $endDate: DateTime
  ) {
    allTargets(
      where: { cycle: $cycle },
      sortBy: [cycle_ASC, cycleTarget_DESC, name_ASC]
    ) {
      ...target
      _targetDoneListMeta(
        where: {
          doneAt_gte: $startDate,
          doneAt_lte: $endDate 
        }
      ) {
        count
      }
      targetDoneList {
        id
        doneAt
      }
    }
  }
  ${targetFragment}
`

export const addTargetMutation = gql`
  mutation(
    $name: String!
    $cycle: Int!
    $cycleTarget: Int!
  ) {
    createTarget(
      data: {
        name: $name
        cycle: $cycle
        cycleTarget: $cycleTarget
      }
    ) {
      ...target
    }
  }
  ${targetFragment}
`

export const updateTargetMutation = gql`
  mutation(
    $id: ID!
    $name: String!
    $cycle: Int!
    $cycleTarget: Int!
  ) {
    updateTarget(
      id: $id
      data: {
        name: $name
        cycle: $cycle
        cycleTarget: $cycleTarget
      }
    ) {
      ...target
    }
  }
  ${targetFragment}
`

export const addTargetDoneMutation = gql`
  mutation(
    $targetId: ID!
  ) {
    createTargetDone(
      data: {
        target: { connect: { id: $targetId } }
      }
    ) {
      ...targetDone
    }
  }
  ${targetDoneFragment}
`

export const deleteTargetMutation = gql`
  mutation($id: ID!) {
    deleteTarget(id: $id) {
      id
    }
  }
`
