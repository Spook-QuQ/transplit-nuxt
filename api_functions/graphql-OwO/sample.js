// this[THIS].schema = createSchema(querySample, mutationType, rootDescription)

const rootDescription = {
  query: 'hello',
  mutation: 'world'
}

// {
//   query: [
//     {
//       name: 'test',
//       fields: {
//         id: 'ID',
//         text: 'String',
//         flag: 'Boolean'
//       },
//       args: {
//         id: {
//           type: 'Number'
//         }
//       },
//       resolve: args => {
//         return { id: 1, text: 'Test text', flag: false }
//       },
//       list: true,
//       listResolve: args => {
//         return [
//           { id: 1, text: 'Test text', flag: false }
//         ]
//       },
//       description: 'This is The Test Type.',
//       typeDescription: 'This is The Type of This Test',
//       listDescription: 'This is The description of own Lists'
//     }
//   ],
//   mutation: [
//     {
//       name: 'insertTest',
//       description: 'Test Mutation Type',
//       typeDescription: 'This is The Test Type of This Mutation',
//       fields: {
//         rs: 'string'
//       },
//       args: {
//         message: {
//           description: 'Test Input Type',
//           type: {
//             name: { type: 'string' },
//             id: { type: 'id', nonNull: true }
//           }
//         }
//       },
//       resolve: args => {
//         return { rs: JSON.stringify(args) }
//       }
//     }
//   ],
//   description: {
//     query: 'Hello',
//     mutation: 'World'
//   }
// }

const querySample = [
  {
    name: 'user',
    idTypeOff: true,
    fields: {
      id: 'ID',
      text: 'String',
      flag: 'Boolean'
    },
    args: {
      id: {
        type: 'string',
        nonNull: true
      },
      uid: {
        type: 'Number',
      }
    },
    resolve: args => {
      // return args.uid + ' test ' + args.id
      return { id: '1', text: 'text', flag: true }
    },
    list: true,
    listArgs: {
      filter: {
        type: 'number'
      }
    },
    listResolve: args => {
      return [{ id: 1, text: 'text', flag: true }]
    },
    description: 'This is The Test Type.',
    typeDescription: 'This is The Type of This Test',
    listDescription: 'This is The description of own Lists'
  }
]

const mutationType = [
  {
    name: 'createMessage',
    description: 'ok daze.',
    fields: {
      id: 'Integer',
      text: 'string',
      flag: 'boolean'
    },
    args: {
      id: {
        type: 'string',
        nonNull: true
      },
      uid: {
        type: 'number',
      }
    },
    resolve: args => {
      return args.uid + ' test ' + args.id
    }
  }
]
