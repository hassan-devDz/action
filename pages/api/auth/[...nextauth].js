import NextAuth from "next-auth";
import {getToken} from 'next-auth/jwt'
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import nextConnect from "next-connect";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../middleware/mongo";

const MONGODB_DB = process.env.MONGODB_DB;
const secret = process.env.SECRET;

// const option = {
//   providers: [
//     // EmailProvider({
//     //   server: {
//     //     host: process.env.EMAIL_SERVER_HOST,
//     //     port: process.env.EMAIL_SERVER_PORT,
//     //     auth: {
//     //       user: process.env.EMAIL_SERVER_USER,
//     //       pass: process.env.EMAIL_SERVER_PASSWORD
//     //     }
//     //   },
//     //   from: process.env.EMAIL_FROM
//     // }),
//     CredentialsProvider({
//       // The name to display on the sign in form (e.g. 'Sign in with...')
//       name: "Credentials",
//       // The credentials is used to generate a suitable form on the sign in page.
//       // You can specify whatever fields you are expecting to be submitted.
//       // e.g. domain, username, password, 2FA token, etc.
//       // You can pass any HTML attribute to the <input> tag through the object.
//       credentials: {
//         domain: {
//           label: "Domain",
//           type: "text ",
//           placeholder: "CORPNET",
//           value: "domain",
//         },
//         username: {
//           label: "Username",
//           type: "text",
//           placeholder: "jsmith",
//           value: "username",
//         },
//         password: { label: "Password", type: "password", value: "password" },
//       },
//       async authorize(credentials, req) {
//        // console.log("authauthauthauth",req,'pass',"authauthauthauth");
//         // Add logic here to look up the user from the credentials supplied
//        // console.log(req,"nextttttttttttttttttttttt",credentials);
//         if (
//           credentials.username === "username" &&
//           credentials.password === "password"
//         ) {
//           // Any object returned will be saved in `user` property of the JWT
//           return {id:2,name:credentials.username,domain:credentials.password};
//         } else {
//           // If you return null or false then the credentials will be rejected
//           return null;
//           // You can also Reject this callback with an Error or with a URL:
//           // throw new Error('error message') // Redirect to error page
//           // throw '/path/to/redirect'        // Redirect to a URL
//         }
//       },
//     }),
//   ],

//   callbacks: {
//     jwt: ({ token, user }) => {
//       // first time jwt callback is run, user object is available
//       if (user) {
//         token.id = user.id;
//       }

//       return token;
//     },
//     session: ({ session, token }) => {
//       if (token) {
//         session.id = token.id;
//       }

//       return session;
//     },
//   },
//   secret: "test",
//   jwt: {
//     secret: "test",
//     encryption: true,
//   },
//   pages:{
//     signIn:'/signin'
//   },

//   // adapter: MongoDBAdapter({
//   //   db: (await clientPromise).db(MONGODB_DB),
//   // }),
// }

//export default async(req, res) => await NextAuth(req, res, option);
async function auth(req, res, next) {
  
  const {password} =  {...req.body}


  return await NextAuth(req, res, {
    
    //some code
    providers: [
      EmailProvider({
        id: "logup",
        server: {
          host: process.env.EMAIL_SERVER_HOST,
          port: process.env.EMAIL_SERVER_PORT,
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        },
        from: process.env.EMAIL_FROM,
      }),
      CredentialsProvider({
        id: "login",
        // The name to display on the sign in form (e.g. 'Sign in with...')
        name: "Credentials",
        // The credentials is used to generate a suitable form on the sign in page.
        // You can specify whatever fields you are expecting to be submitted.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
          domain: {
            label: "Domain",
            type: "text ",
            placeholder: "CORPNET",
            value: "domain1",
          },
          username: {
            label: "Username",
            type: "text",
            placeholder: "jsmith",
            value: "username",
          },
          password: { label: "Password", type: "password", value: "password" },
        },
        async authorize(credentials, req) {
          //console.log("authauthauthauth",req,'pass',"authauthauthauth",credentials);
          // Add logic here to look up the user from the credentials supplied
          // console.log(req,"nextttttttttttttttttttttt",credentials);
          if (
            credentials.username === "username" &&
            credentials.domain === credentials.domain
          ) {
            // Any object returned will be saved in `user` property of the JWT
            return {
              id: 2,
              name: credentials.username,
              domain: credentials.domain,
            };
          } else {
            // If you return null or false then the credentials will be rejected
            return null;
            // You can also Reject this callback with an Error or with a URL:
            // throw new Error('error message') // Redirect to error page
            // throw '/path/to/redirect'        // Redirect to a URL
          }
        },
      }),
    ],

    callbacks: {
      jwt: async ({ token, user, account, profile, isNewUser }) => {
        // first time jwt callback is run, user object is available
        const token1 = await getToken({ req, secret })  
        
        if (user) {
          token.id = user.id;
          
         
        }

        return token;
      },
      session: ({ session, token }) => {
        
        if (token) {
          session.id = token.id;
          
        }

        return session;
      },
      signIn: async ({ user, account, profile, email, credentials }) => {
       const databasse = await clientPromise.db(MONGODB_DB).collection("auth")
        console.log(databasse);
        //findAndDelete
        if (email.verificationRequest) {
          console.log(user,{...req.body},email);
        }
      
       
       
        const adapter = await MongoDBAdapter({
          db: (await clientPromise).db(MONGODB_DB), //الاتصال بقاعدة البيانات والتأكد ان المستخدم غير مسجل ممن قبل
        })
        const isUserExist= await adapter.getUserByEmail(user.email);
       
        if (isUserExist) {
          return false; //Access Denied
        }
       
        return true; //verify-request ارسال رسالة التفعيل الى البريدد الالكتروني للمستخدم الجديد
      },
    },
    events: {
      async signIn(message) { console.log(message,"/* on successful sign in */");/* on successful sign in */ },
      async signOut(message) { console.log(message,"/* on signout */");/* on signout */ },
      async createUser(message) {console.log(message,"/* user created */") /* user created */ },
      async updateUser(message) { console.log(message,"/* user updated - e.g. their email was verified */")/* user updated - e.g. their email was verified */ },
      async linkAccount(message) { /* account (e.g. Twitter) linked to a user */ },
      async session(message) { console.log(message,"/* session is active */")/* session is active */ },
      async error(message) { /* error in authentication flow */ }
    },
    session: {
      jwt: true,
    },
    // secret: "test",
    jwt: {
      // A secret to use for key generation - you should set this explicitly
      // Defaults to NextAuth.js secret if not explicitly specified.
      // This is used to generate the actual signingKey and produces a warning
      // message if not defined explicitly.
      secret: 'INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnw',
      // You can generate a signing key using `jose newkey -s 512 -t oct -a HS512`
      // This gives you direct knowledge of the key used to sign the token so you can use it
      // to authenticate indirectly (eg. to a database driver)
     
      // Set to true to use encryption. Defaults to false (signing only).
      //encryption: true,
    
      // You can define your own encode/decode functions for signing and encryption
      // if you want to override the default behaviour.
      
    },

    pages: {
      signIn: "/auth/login",
      signOut: "/auth/login",
      error: "/auth/error", // Error code passed in query string as ?error=
      verifyRequest: "/auth/verify-request",
      //newUser: "/auth/signin",
    },
  
    adapter: MongoDBAdapter({
      db: (await clientPromise).db(MONGODB_DB),
    }),
  });
}
//   return await NextAuth(req, res, );
// }
// const middleware = nextConnect();

// middleware.use(auth);

export default auth;
