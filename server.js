var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcrypt');

const saltRounds = 10;
const prisma = new PrismaClient();
var schema = buildSchema(`
	type Query {
		users: [User]
		user(id: Int!): User
		project(id: Int!): Project
		createUser(name: String!, email: String!, password: String!): functionResult
		authenticateUser(email: String!, password: String!): functionResult
	}
	type User {
		id: Int!
		name: String!
		projects:  [Project!]!
	  }
	  type Project {
		id: Int!
		name: String!
		description: String!
		contributors: [User!]!
	  }
	  type functionResult {
		  result: Boolean!
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
	createUser: async (args) => {
		let result = undefined;
		await prisma.user.create({
			data: {
				name: args.name,
				email: args.email,
				password: bcrypt.hashSync(args.password, saltRounds)
			}
		}).then(() => { result = true }, () => { result = false }).finally(() => { prisma.$disconnect() });
		return {
			result: result
		}
	},
	authenticateUser: async (args) => {
		let verified = undefined;
		await prisma.user.findUnique({
			where: {
				email: args.email
			}
		}).then((user) => {
			verified = bcrypt.compareSync(args.password, user.password);
		}).finally(() => { prisma.$disconnect(); });
		return {
			result: verified
		}
	},
};

var app = express();
app.use('/graphql', graphqlHTTP({
	schema: schema,
	rootValue: root,
	graphiql: true,
}));
app.listen(4000);