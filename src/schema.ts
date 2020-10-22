import { makeSchema, queryType, objectType, mutationType,arg, idArg  } from "@nexus/schema";
import { nexusSchemaPrisma } from "nexus-plugin-prisma/schema";
import path from "path";
import bcrypt from 'bcrypt';
import getUserId from './utils/getUserId';
import generateToken from './utils/generateToken';
import hashPassword from './utils/hashPassword';

const User = objectType({
  name: "User",
  definition(t) {
    t.model.id();
    t.model.email();
    t.model.password();
    t.model.role()
  },
});
const Query = queryType({
   definition (t) {
    t.crud.user();
    t.crud.users()
  }
})


const Mutation = mutationType({
   definition(t) {
    t.crud.createOneUser({
       resolve: async (_root, args, ctx) => {
        const password = await hashPassword(args.data.password)
        return ctx.prisma.user.create({
          data: {
            ...args.data,
            password
          }
        })
    }})
  }
})

export const schema = makeSchema({
  types: { Query, User, Mutation },
  // CRUD won't work without this option!!!
  plugins: [nexusSchemaPrisma({ experimentalCRUD: true })],
  outputs: {
    schema: path.join(process.cwd(), "schema.graphql"),
    typegen: path.join(process.cwd(), "nexus.ts"),
  },
  typegenAutoConfig: {
    contextType: "Context.Context",
    sources: [
      {
        source: "@prisma/client",
        alias: "prisma",
      },
      {
        source: require.resolve("./context"),
        alias: "Context",
      },
    ],
  },
});

