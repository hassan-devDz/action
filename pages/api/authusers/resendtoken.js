
import nextConnect from 'next-connect'
import auth, { AuthNotRequired ,AuthIsRequired} from "../../../middleware/auth";
import sendVerificationEmail from '../../../middleware/sendemail'
import crypto from "crypto";
import {findAndUpdate} from '../../../lib/dbRely'
import verifycaptcha from "../../../middleware/verifyCaptcha";
const handler = nextConnect()


handler.use(verifycaptcha).use(auth).use(AuthNotRequired)
.post(async(req, res) => {
    const  {email}  = await req.body
    console.log(email);
    const token = await crypto.randomBytes(32).toString("hex");
    if (!email ) {
      return res.status(400).send('Missing fields')
    }
    // Here you check if the username has already been used
    // const emailExisted = await findUserByEmail(req.db, email)
   
    // if (emailExisted) {
    //   return res.status(409).send('The email has already been used')
    // }
    
    // Security-wise, you must hash the password before saving it
    // const hashedPass = await argon2.hash(password);
    // const user = { username, password: hashedPass, name }
    const user = await findAndUpdate(req,{email:email},{confirmationCode:token},"verification_tokens")
    console.log(user);
    return res.status(201).json({message:user})
    
    
    
    //createUser(req, req.body)
    
    
  })
export default handler