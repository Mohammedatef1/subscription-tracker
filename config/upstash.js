import { Client } from "@upstash/workflow";
import { QSTASH_URL, QSTASH_TOKEN } from "./env.js";

export const workflow = new Client({
  baseUrl: QSTASH_URL,
  token: QSTASH_TOKEN
})