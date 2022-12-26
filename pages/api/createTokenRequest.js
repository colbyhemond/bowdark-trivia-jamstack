// import Ably from "ably/promises";

// let client

// export default async function handler(req, res) {
//     console.log('received request');
//     console.log(process.env.ABLY_ON);
//     if (process.env.ABLY_ON === 'true') {
//         console.log('testing');
//         if (!client) {
//             console.log("Getting Ably Realtime Connection from createTokenRequest")
//             client = new Ably.Realtime({
//                 key: process.env.ABLY_API_KEY
//             });
//         }
        
//         const tokenRequestData = await client.auth.createTokenRequest({ clientId: 'bowdark-test' });
//         console.log(tokenRequestData);
//         res.status(200).json(tokenRequestData);
//     } else {
//         res.status(200).json({message: 'Ably Turned Off'});
//     }


// };

import * as dotenv from "dotenv";
import * as Ably from "ably/promises";
import { getToken } from "next-auth/jwt"

const secret = process.env.NEXTAUTH_SECRET

dotenv.config();

export default async function handler(req, res) {

  console.log('/api/createTokenRequest called')

  if (!process.env.ABLY_API_KEY) {
    return res
            .status(500)
            .setHeader("content-type", "application/json")
            .json({
              errorMessage: `Missing ABLY_API_KEY environment variable.
                If you're running locally, please ensure you have a ./.env file with a value for ABLY_API_KEY=your-key.
                If you're running in Netlify, make sure you've configured env variable ABLY_API_KEY. 
                Please see README.md for more details on configuring your Ably API Key.`,
            })
    }

  const token = await getToken({ req, secret })
  console.log("JSON Web Token", token)

  const clientId = req.body["clientId"] || process.env.DEFAULT_CLIENT_ID || "NO_CLIENT_ID";
  const client = new Ably.Rest(process.env.ABLY_API_KEY);
  const tokenRequestData = await client.auth.createTokenRequest({ clientId: clientId });

  return res.status(200).json(tokenRequestData)
}
