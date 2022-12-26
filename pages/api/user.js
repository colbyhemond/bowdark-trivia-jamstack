import clientPromise from "../../lib/utils/mongodb.js";
import {ObjectId} from 'mongodb'
// import { withAuth } from "@clerk/nextjs/api";

import { getToken } from "next-auth/jwt"
const secret = process.env.NEXTAUTH_SECRET

export default async function handler(req, res) {
  //Authorization
  // const { userId, sessionId, getToken } = req.auth;

  //General
  try {
  console.log('ℹ️ Request Received');
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);


  console.log('get token');
  const token = await getToken({ req, secret })
  console.log("JSON Web Token", token)

  
    switch (req.method) {
      case "POST":
        console.log('POST Request Received');

        let bodyObject = req.body ? JSON.parse(req.body) : null;
        const insertUserResponse = await db.collection("users").insertOne(bodyObject)
        
        res.status(201).json('')
        return

      case "GET":
        console.log('GET Request Received');

        const rawUser = await db.collection("users").find({ "localId": req.query.localId }).toArray()

        const cleanUser = rawUser.map(user => {
          return {localId: user.localId, name: user.name}
        })

        res.status(200).json(cleanUser)
        return
      case "PUT":
        console.log('PUT Request Received');

        let userToUpdate = req.body ? JSON.parse(req.body) : null;
        const updateUserResponse = await db.collection("users").updateOne({"localId": userToUpdate.localId}, {$set: {"name": userToUpdate.name}})
        
        res.status(201).json('')
        return

      case 'DELETE':
        console.log('DELETE Request Received');

        const body = JSON.parse(req.body)

        if (item.deletedCount === 1) {
          res.status(204).json('')
          return
        } else {
          res.status(404).json('')
          return
        }

    }

  } catch (error) {
    console.log(error);
    res.status(500).json(error)
  }
}