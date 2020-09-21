const { User, Collection } = require("../models");
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
                .populate('collections')
                .populate('friends');
                
                return userData;
            }

            throw new AuthenticationError('Not logged in');
        },
        collections: async (parent, { username }) => {
            const params = username ? { username } : {};
            return Collection.find(params).sort({ createdAt: -1 });
        },
        collection: async (parent, { _id }) => {
            return Collection.findOne({ _id });
        },
        users: async () => {
            return User.find()
            .select('-__v -password')
            .populate('friends')
            .populate('collections');
        },
        user: async (parent, { username }) => {
            return User.findOne({ username })
            .select('-__v -password')
            .populate('friends')
            .populate('collections');
        }
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },
        addCollection: async (parent, args, context) => {
            if (context.user) {
                const collection = await Collection.create({ ...args, username: context.user.username });

                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { collections: collection._id } },
                    { new: true }
                );

                return collection;
            }

            throw new AuthenticationError('You need to be logged in!');
        },
        addOtherCollection: async (parent, { collectionId, collectionBody }, context) => {
            if (context.user) {
              const updatedCollection = await Collection.findOneAndUpdate(
                { _id: collectionId },
                { $push: { otherCollections: { collectionBody, username: context.user.username } } },
                { new: true, runValidators: true }
              );
          
              return updatedCollection;
            }
          
            throw new AuthenticationError('You need to be logged in!');
        },
        addFriend: async (parent, { friendId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { friends: friendId } },
                    { new: true }
                ).populate('friends');

                return updatedUser;
            }

            throw new AuthenticationError('You need to be logged in!');
        }
    }
};

module.exports = resolvers;