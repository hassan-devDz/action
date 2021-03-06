import { MongoClient } from "mongodb";
import nextConnect from "next-connect";
/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentiatlly
 * during API Route usage.
 * https://github.com/vercel/next.js/pull/17666
 */
const MONGODB_DB = process.env.MONGODB_DB;

global.mongo = global.mongo || {};

export async function getMongoClient() {
  if (!global.mongo.client) {
    global.mongo.client = new MongoClient(process.env.MONGODB_URI_LOCAL);
  }
  // It is okay to call connect() even if it is connected
  // using node-mongodb-native v4 (it will be no-op)
  // See: https://github.com/mongodb/node-mongodb-native/blob/4.0/docs/CHANGES_4.0.0.md
  await global.mongo.client.connect();
  return global.mongo.client;
}

async function database(req, res, next) {
  if (!global.mongo.client) {
    global.mongo.client = new MongoClient(process.env.MONGODB_URI_LOCAL);
  }
  req.dbClient = await getMongoClient();
  req.db = req.dbClient.db(MONGODB_DB); // this use the database specified in the MONGODB_URI (after the "/")
  //if (!indexesCreated) await createIndexes(req.db);
  return next();
}
const middleware = nextConnect({
  onError(err, req, res) {
    res.status(501).json({ error: `sorry ${err.message}` });
  },
});

middleware.use(database);

export default middleware;
