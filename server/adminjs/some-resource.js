import { Components } from './components.js'

export const SomeResource = {
  resource: Something, // database model
  options: {
    properties: {
      someText: {
        type: 'string',
        components: {
          edit: Components.MyInput, // this is our custom component
        },
      },
    },
  },
}