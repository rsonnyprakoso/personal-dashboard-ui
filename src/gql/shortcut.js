import gql from 'graphql-tag';

export const shortcutFragment = gql`
  fragment shortcut on Shortcut {
    id
    name
    url
    icon
  }
`

export const getAllShortcutsQuery = gql`
  query {
    allShortcuts {
      ...shortcut
    }
  }
  ${shortcutFragment}
`