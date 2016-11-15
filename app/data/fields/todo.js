import {
    GraphQLInt,
    GraphQLString,
    GraphQLObjectType
} from 'graphql'

const TodoType = new GraphQLObjectType({
    name: "Todo",
    fields: () => ({
        id: {type: GraphQLString},
        text: {type: GraphQLString}
    })
})

export default {
    type: TodoType,
    args: {
        id: {type: GraphQLInt}
    },
    resolve(root, args) {
        return getTodo(args.id)
    }
}

function getTodo(id) {
    const todos = [
        {
            id: 1,
            text: "Hello, world!"
        },
        {
            id: 2,
            text: "Azaza"
        }
    ]

    return todos.filter(todo => todo.id === id)[0]
}
