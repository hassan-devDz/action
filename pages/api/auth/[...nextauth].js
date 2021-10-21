import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import nextConnect from "next-connect";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../middleware/mongo";

const MONGODB_DB = process.env.MONGODB_DB;
console.log(process.env.EMAIL_SERVER_HOST);
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
  // console.log("authauthauthauth",req.body,'pass',"authauthauthauth");
  return await NextAuth(req, res, {
    providers: [
      // EmailProvider({
      //   server: {
      //     host: process.env.EMAIL_SERVER_HOST,
      //     port: process.env.EMAIL_SERVER_PORT,
      //     auth: {
      //       user: process.env.EMAIL_SERVER_USER,
      //       pass: process.env.EMAIL_SERVER_PASSWORD
      //     }
      //   },
      //   from: process.env.EMAIL_FROM
      // }),
      CredentialsProvider({
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
         // console.log("authauthauthauth",req,'pass',"authauthauthauth");
          // Add logic here to look up the user from the credentials supplied
         // console.log(req,"nextttttttttttttttttttttt",credentials);
          if (
            credentials.username === "username" &&
            credentials.domain === credentials.domain
          ) {
            // Any object returned will be saved in `user` property of the JWT
            return {id:2,name:credentials.username,domain:credentials.domain};
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
      jwt: ({ token, user }) => {
        // first time jwt callback is run, user object is available
        if (user) {
          token.id = user.id;
          token.domain=user.domain
        }
  
        return token;
      },
      session: ({ session, token }) => {
        if (token) {
          session.id = token.id;
          session.user.domain = token.domain;
        }
  
        return session;
      },
    },
    secret: "test",
    jwt: {
      secret: "test",
      encryption: true,
    },
    pages:{
      signIn:'/auth/signin',
      signOut:'/auth/login'
    },
    
  
    
   
    // adapter: MongoDBAdapter({
    //   db: (await clientPromise).db(MONGODB_DB),
    // }),
  });
  
}
//   return await NextAuth(req, res, );
// }
// const middleware = nextConnect();

// middleware.use(auth);

 export default auth;
