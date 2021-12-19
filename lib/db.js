import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { ObjectId } from 'mongodb';

export function getAllUsers(req) {
  // For demo purpose only. You are not likely to have to return all users.
  return req.session.users
}

export function createUser(req, { email, password, name ,createdAt,_id}) {
  // Here you should create the user and save the salt and hashed password (some dbs may have
  // authentication methods that will do it for you so you don't have to worry about it):
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex')
  const user = {
    _id,
    createdAt,
    email,
    name,
    hash,
    salt,
  }

  // Here you should insert the user into the database
  // await db.createUser(user)
  req.session.users.push(user)
}

export  function  findUserByUsername(req, email) {
  // Here you find the user based on id/email in the database
  // const user = await db.findUserById(id)
  console.log(req.session.users,"Here you findHere you find");
  return  req.session.users.find((user) => user.email === email)
}

export function updateUserByUsername(req, email, update) {
  // Here you update the user based on id/username in the database
  // const user = await db.updateUserById(id, update)
  const user = req.session.users.find((u) => u.email === email)
  Object.assign(user, update)
  return user
}

export function deleteUser(req, email) {
  // Here you should delete the user in the database
  // await db.deleteUser(req.user)
  req.session.users = req.session.users.filter(
    (user) => user.email !== req.user.email
  )
}

// Compare the password of an already fetched user (using `findUserByUsername`) and compare the
// password for a potential match
export function validatePassword(user, inputPassword) {
  const inputHash = crypto
    .pbkdf2Sync(inputPassword, user.salt, 1000, 64, 'sha512')
    .toString('hex')
  const passwordsMatch = user.hash === inputHash
  return passwordsMatch
}
