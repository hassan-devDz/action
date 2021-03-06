import { MongoClient } from "mongodb";
import nextConnect from "next-connect";
import clientPromise from './mongo'

const MONGODB_URI = process.env.MONGODB_URI_LOCAL;
const MONGODB_DB = process.env.MONGODB_DB;

const client = new MongoClient(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function database(req, res, next) {
  await client.connect();
  req.dbClient = client;
  req.db = client.db(MONGODB_DB);
  return next();
}

const middleware = nextConnect({
  onError(err,req,res){
    res.status(501).json({error:`sorry ${err.message}`})
  }
})

middleware.use(database);

export default middleware;
// async function database(req, res, next) {
//   await clientPromise
//   req.dbClient = clientPromise;
//   req.db = clientPromise.db(MONGODB_DB);
//   return next();
// }
// const middleware = nextConnect();

// middleware.use(database);

// export default middleware;