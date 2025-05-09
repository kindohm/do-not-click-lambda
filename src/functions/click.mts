import type { Context } from "@netlify/functions";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = JSON.parse(process.env.FB_CONFIG ?? "{}");
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const responses = [
  `You weren't supposed to do that.`,
  `Please do not click the button again.`,
  `You clicked the button. You rebel.`,
  `You weren't supposed to click the button.`,
  `STAHHHHP!`,
];

const randInt = (min: number, max: number) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
};

export default async (req: Request, context: Context) => {
  const payload = await req.json();
  const response = responses[randInt(0, responses.length - 1)];

  const docRef = await addDoc(collection(db, "clicks"), {
    fingerprint: payload.fingerprint,
    timestamp: new Date(),
    response
  });

  return new Response(response, {
    headers: {
       'access-control-allow-origin': '*'
    }
  });
};


/* CORS

import type {Config, Context} from '@netlify/edge-functions'
export default async (request : Request, context : Context) => {
  const response = await context.next()
  return new Response(response.body, {
    headers: {
       'access-control-allow-origin': '*'
    }
  })
}
export const config : Config = {
  path: '/*'
}

*/