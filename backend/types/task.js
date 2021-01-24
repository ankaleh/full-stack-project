const { UserInputError, AuthenticationError, gql } = require('apollo-server')
const Task = require('../models/taskModel')
const User = require('../models/userModel')

const typeDefs = gql`
    type Task {
        id: ID!
        description: String!
        addedBy: User!
        doneBy: User
        done: Boolean!
    }
    extend type Query {
        allTasks: [Task!]!
    }
    extend type Mutation {
        addTask(
            description: String!
        ): Task
        markAsDone(
            description: String!
        ): Task
    }
`
const resolvers = {
  Query: {
    allTasks: (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('Not authenticated backend.taskissa!')
      }
      return Task.find({})
    }
  },
  Mutation: {
    addTask: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('Not authenticated backend.taskissa!!')
      }
      const task = new Task({ ...args, done: false, addedBy: currentUser })
      try {
        await task.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return task
    },
    markAsDone: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('Not authenticated backend.taskissa!!')
      }
      const task = await Task.findOne({ description: args.description })//tähän vaihdettava id hakuavaimeksi
      task.done = true
      task.doneBy = currentUser

      try {
        await task.save()
        currentUser.tasks = currentUser.tasks.concat(task)
        await currentUser.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return task
    },
  },
  Task: {
    addedBy: async (root) => {
      const user = await User.findById(root.addedBy)
      return user
    },
    doneBy: async (root) => {
      const user = await User.findById(root.doneBy)
      return user
    }
  }

}

module.exports = { typeDefs, resolvers }