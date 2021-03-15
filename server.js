var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
var schema = buildSchema(`
	type Query {
		users: [User]
		user(id: Int!): User
		project(id: Int!): Project
		projects: [Project]
	}
	type User {
		id: Int!
		name: String!
		email: String!
		projects:  [Project!]
	  }
	  type Project {
		id: Int!
		name: String!
		description: String!
		contributors: [User!]!
	  }
`);


// The root provides a resolver function for each API endpoint
var root = {
	users: async () => {
		return await prisma.user.findMany({ include: { projects: true } }).finally(() => { prisma.$disconnect() });
	},
	user: async (args) => {
		return await prisma.user.findUnique({
			where: {
				id: args.id
			},
			include: {
				projects: true
			}
		}).finally(() => { prisma.$disconnect() });
	},
	projects: async () => {
		return await prisma.project.findMany({ include: { contributors: true } }).finally(() => { prisma.$disconnect() });
	},
	project: async (args) => {
		return await prisma.project.findUnique({
			where: {
				contributors: {
					id: args.id
				}
			},
			include: {
				contributors: true
			}
		}).finally(() => { prisma.$disconnect() });
	},
};

var app = express();
app.use('/graphql', graphqlHTTP({
	schema: schema,
	rootValue: root,
	graphiql: true,
}));
app.listen(4000);