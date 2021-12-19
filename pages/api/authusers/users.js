import nextConnect from 'next-connect'
import auth from '../../../middleware/auth'

import {insertUser,findUserByEmail} from '../../../lib/dbRely'

const handler = nextConnect()



handler.use(auth)
.get((req, res) => {
    // For demo purpose only. You will never have an endpoint which returns all users.
    // Remove this in production
    //console.log(req.isAuthenticated());
    res.json({ users: req.user })
  })
  .post(async(req, res) => {
    const { email, password, name } = await req.body
    if (!email || !password || !name) {
      return res.status(400).send('Missing fields')
    }
    // Here you check if the username has already been used
    const usernameExisted = await findUserByEmail(req.db, email)
   
    if (usernameExisted) {
      return res.status(409).send('The username has already been used')
    }
    const user = { email, password, name }
    // Security-wise, you must hash the password before saving it
    // const hashedPass = await argon2.hash(password);
    // const user = { username, password: hashedPass, name }
    
    const uset = await insertUser(req)
    
    //createUser(req, req.body)
    
    req.logIn(uset, (err) => {
      if (err) throw err
      // Log the signed up user in
      res.status(201).json({
        uset,
      })
    })
  })

export default handler
