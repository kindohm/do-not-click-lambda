import type { Context } from "@netlify/functions";
import {words} from "./../words";
import { randInt } from "../util";

export default async (req: Request, context: Context) => {
  if (req.method === "OPTIONS") {
    const res = new Response();

    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.append("Access-Control-Allow-Headers", "*");
    res.headers.append("Access-Control-Allow-Methods", "*");

    return res;
  }

  const fingerprint = Array.from({ length: 3 })
    .map(() => {
      return words[randInt(0, words.length - 1)];
    })
    .join("-");

  const res = new Response(fingerprint);
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.append("Access-Control-Allow-Headers", "*");
  res.headers.append("Access-Control-Allow-Methods", "*");

  return res;
};
