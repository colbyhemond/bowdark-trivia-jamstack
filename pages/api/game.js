import clientPromise from "../../lib/utils/mongodb.js";
import {ObjectId} from 'mongodb'
// import { withAuth } from "@clerk/nextjs/api";

export default async function handler(req, res) {
  //Authorization
  // const { userId, sessionId, getToken } = req.auth;

  //General
  try {
  console.log('ℹ️ Request Received');
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

  
    switch (req.method) {
      case "POST":
        console.log('POST Request Received');

        let bodyObject = req.body ? JSON.parse(req.body) : null;
        const insertQuestionResponse = await db.collection("games").insertOne(bodyObject)
        
        res.status(201).json('')
        return

      case "GET":
        console.log('GET Request Received');

        const rawQuestions = await db.collection("games").find({ "game": req.query.game }).toArray()

        const cleanQuestions = rawQuestions.map(question => {
          return question.question
        })

        res.status(200).json(cleanQuestions)
        return
      case "PUT":
        console.log('PUT Request Received');

        res.status(201).json(req)
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