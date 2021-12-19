import crypto from 'crypto'
import nextConnect from 'next-connect'
import auth ,{AuthNotRequired}from '../../../middleware/auth'
import sendVerificationEmail from '../../../middleware/sendemail'
import verifycaptcha from '../../../middleware/verifyCaptcha'
import {validate} from '../../../middleware/validate'
import {FormInfoInterestedSchema} from '../../../schemas/schemas_moassa';
const token = crypto.randomBytes(32).toString('hex');

const handler = nextConnect()


handler.use(verifycaptcha).use(auth).use(AuthNotRequired)
.post(async(req, res) => {
  const user = await sendVerificationEmail(req,res)
    // const { email, password, name } = await req.body
    // if (!email || !password || !name) {
    //   return res.status(400).send('Missing fields')
    // }
    // Here you check if the username has already been used
    // const emailExisted = await findUserByEmail(req.db, email)
   
    // if (emailExisted) {
    //   return res.status(409).send('The email has already been used')
    // }
    
    // Security-wise, you must hash the password before saving it
    // const hashedPass = await argon2.hash(password);
    // const user = { username, password: hashedPass, name }
    
    
    
    
    
    //createUser(req, req.body)
    
    
  })

export default validate(FormInfoInterestedSchema,handler) 
