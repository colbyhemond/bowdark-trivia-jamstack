import clientPromise from "../../lib/utils/mongodb.js";
import {ObjectId} from 'mongodb'
// import { withAuth } from "@clerk/nextjs/api";

export default async function handler(req, res) {
  //Authorization
  // const { userId, sessionId, getToken } = req.auth;

  //General
  console.log('ℹ️ Request Received');

  res.status(201).json({msg: 'Hello threre! It worked!'})
  return
}