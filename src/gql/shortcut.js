import gql from 'graphql-tag';

export const shortcut = gql`
  fragment shortcut on Shortcut {
    id
    name
    url
    icon
  }
`

export const getAllShortcuts = gql`
  query {
    allShortcuts {
      ...shortcut
    }
  }
  ${shortcut}
`