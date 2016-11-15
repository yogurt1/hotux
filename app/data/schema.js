import {
    GraphQLSchema,
    GraphQLObjectType
} from 'graphql'

import fields from './fields'

const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => fields
})

export default new GraphQLSchema({
    query: QueryType
})
