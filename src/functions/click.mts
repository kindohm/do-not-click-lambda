import type { Context } from "@netlify/functions";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { randInt } from "../util";

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

export default async (req: Request, context: Context) => {
  if (req.method === "OPTIONS") {
    const res = new Response();

    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.append("Access-Control-Allow-Headers", "*");
    res.headers.append("Access-Control-Allow-Methods", "*");

    return res;
  }

  const payload = await req.json();
  const response = responses[randInt(0, responses.length - 1)];

  const docRef = await addDoc(collection(db, "clicks"), {
    fingerprint: payload.fingerprint,
    timestamp: new Date(),
    response,
  });

  return new Response(response, {
    headers: {
      "access-control-allow-origin": "*",
    },
  });
};
