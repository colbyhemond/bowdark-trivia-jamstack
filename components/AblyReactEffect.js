import Ably from "ably/promises";
import { useEffect } from 'react'

let ably

if (process.env.NEXT_PUBLIC_ABLY_ON === 'true') {
    console.log("Getting Ably Realtime Connection from AblyReactEffect")
    ably = new Ably.Realtime.Promise({ authUrl: 'http://localhost:3000/api/createTokenRequest' });
}

export function useChannel(channelName, callbackOnMessage) {

    if (process.env.NEXT_PUBLIC_ABLY_ON === 'false') {
        let channel = {}
        let ably = {}
        return [channel, ably]
    }

    if (!ably) {
        console.log("Getting Ably Realtime Connection from AblyReactEffect")
        ably = new Ably.Realtime.Promise({ authUrl: 'http://localhost:3000/api/createTokenRequest' });
    }

    const channel = ably.channels.get(channelName);

    const onMount = () => {
        channel.subscribe('answer', answer => { callbackOnMessage(answer); });
    }

    const onUnmount = () => {
        channel.unsubscribe();
    }

    const useEffectHook = () => {
        onMount();
        return () => { onUnmount(); };
    };

    useEffect(useEffectHook, []);

    return [channel, ably];
}