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
    resolve(root, args, {loaders}) {
        return loaders.todo.load(args.id)
    }
}

