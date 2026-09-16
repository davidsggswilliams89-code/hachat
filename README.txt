# Harka Chat — Real AI Chat

This version uses a small Node.js backend so the OpenAI API key is NOT exposed in browser JavaScript.

## 1. Install Node.js

Install Node.js on the computer/server that will host Harka Chat.

## 2. Put these files in the same website folder

- index.html
- chat.html
- server.js
- package.json
- .env

Your existing `images/` folder should also be there.

## 3. Create `.env`

Copy `.env.example` to `.env` and put your API key there:

OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5.6-luna
PORT=3000

NEVER put the API key inside index.html or chat.html.

## 4. Install dependencies

npm install

## 5. Start the website

npm start

Then open:

http://localhost:3000

The Chat buttons already point to chat.html?user=...

## Important

The browser talks to `/api/chat`, and the server talks to OpenAI.
This keeps the API key on the server instead of exposing it to visitors.

The profile chats are explicitly labeled as AI and must not be presented as real people.
