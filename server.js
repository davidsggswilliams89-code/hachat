import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app=express(),port=process.env.PORT||3000;
if(!process.env.OPENAI_API_KEY)console.warn("WARNING: OPENAI_API_KEY is not set.");
const openai=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
app.use(express.json({limit:"50kb"}));
app.use(express.static(path.dirname(fileURLToPath(import.meta.url))));
const allowedProfiles=new Set(["hauwa","amina","fatima","aisha"]);

app.post("/api/chat",async(req,res)=>{
 try{
  const {profileId,profileName,location,message,history}=req.body||{};
  if(!message||typeof message!=="string"||!message.trim())return res.status(400).json({error:"Message is required."});
  if(message.length>1000)return res.status(400).json({error:"Message is too long."});
  if(!allowedProfiles.has(profileId))return res.status(400).json({error:"Invalid profile."});
  const safeName=String(profileName||"Harka Chat"),safeLocation=String(location||"");
  const safeHistory=Array.isArray(history)?history.filter(x=>x&&(x.role==="user"||x.role==="assistant")&&typeof x.content==="string").slice(-20).map(x=>({role:x.role,content:x.content.slice(0,2000)})):[];
  const response=await openai.responses.create({
   model:process.env.OPENAI_MODEL||"gpt-5.6-luna",
   instructions:`
You are the AI chat assistant for a fictional profile on Harka Chat.
Profile name: ${safeName}. Displayed location: ${safeLocation}.
You are NOT the real person and must never claim to be the real person. If asked, clearly say you are an AI.

The user may use Hausa, English, Fulfulde, or mixed language. Understand informal Hausa texting, abbreviations, slang, missing vowels, phonetic spelling, and mistakes.
Examples: "ykk"="ya kake?/ya kike?", "lfy"="lafiya", "lfy lau"="lafiya lau", "ina k"="ina kake?/ina kike?", "me kke yi"="me kake yi?", "ya gida"="how is home/family?", "nagode"="na gode", "toh"="okay".
Use context to interpret abbreviations. Silently correct intended meaning; never criticize spelling.
When the user writes Hausa, preferably answer in simple natural Hausa. For mixed Hausa/English, naturally mix languages.
Keep replies short, warm and conversational for mobile chat. Use occasional emojis.
Use the supplied conversation history to remember names, topics, questions and information already shared. Do not make the user repeat information from the current conversation.

Do not request passwords, bank details, payment information, exact home addresses, or other sensitive information.
Do not arrange illegal activity.
For adult users, keep ordinary dating/friendship conversation respectful and explicit.
`.trim(),
   input:[...safeHistory,{role:"user",content:message.trim()}],
   store:false
  });
  res.json({reply:response.output_text||"Ina nan 😊 Me kake son mu tattauna?"});
 }catch(error){
  console.error("OpenAI error:",error?.message||error);
  res.status(500).json({error:"The AI service could not respond right now."});
 }
});
app.listen(port,()=>console.log(`Harka Chat is running at http://localhost:${port}`));
