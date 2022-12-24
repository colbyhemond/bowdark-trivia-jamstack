import Ably from "ably/promises";

let client

export default async function handler(req, res) {
    console.log('received request');
    console.log(process.env.ABLY_ON);
    if (process.env.ABLY_ON === 'true') {
        console.log('testing');
        if (!client) {
            console.log("Getting Ably Realtime Connection from createTokenRequest")
            client = new Ably.Realtime({
                key: process.env.ABLY_API_KEY
            });
        }
        
        const tokenRequestData = await client.auth.createTokenRequest({ clientId: 'bowdark-test' });
        console.log(tokenRequestData);
        res.status(200).json(tokenRequestData);
    } else {
        res.status(200).json({message: 'Ably Turned Off'});
    }


};