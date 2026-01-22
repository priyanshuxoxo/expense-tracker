import dotenv from "dotenv";
import express from "express";
import http from "http";
import cors from "cors";

import passport from "passport";
import { GraphQLLocalStrategy, buildContext } from "graphql-passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";
import connectDB from "./db/connectDB.js";

import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@as-integrations/express5";
import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";
import { configurePassport } from "./passport/passport.config.js";
dotenv.config();
configurePassport();
const app = express();
const httpServer = http.createServer(app);
const MongoDbStore = connectMongo(session);
const store = new MongoDbStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});
store.on("error", function (error) {
  console.log(error);
});
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      httpOnly: true,
    },
    store: store,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Ensure we wait for our server to start
await server.start();

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
  "/",
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req }) => buildContext({ req, res }),
  }),
);
// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDB();
console.log(`🚀 Server ready at http://localhost:4000/`);
