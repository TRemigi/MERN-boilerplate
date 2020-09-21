// import the gql tagged template function 
const { gql } = require('apollo-server-express');

// create typeDefs
const typeDefs = gql`
type User {
    _id: ID
    username: String
    email: String
    friendCount: Int
    collections: [collection]
    friends: [User]
}

type Collection {
    _id: ID
    collectionText: String
    createdAt: String
    username: String
    otherCollectionCount: Int
    otherCollections: [Reaction]
}

type OtherCollection {
    _id: ID
    collectionBody: String
    createdAt: String
    username: String
}

type Auth {
    token: ID!
    user: User
}

type Query {
    me: User
    users: [User]
    user(username: String!): User
    collections(username: String): [Collection]
    collection(_id: ID!): Collection
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addCollection(collectionText: String!): Collection
    addOtherCollection(collectionId: ID!, collectionBody: String!): Collection
    addFriend(friendId: ID!): User
}
`;

//export the typeDefs
module.exports = typeDefs;