import { Request, Response } from 'express';
import fs from 'fs';
import OpenAI from 'openai';

interface Message {
  role: "system" | "user";
  content: string;
}


export const getAIResponse = async (req: Request, res: Response): Promise<void> => {
  try {
    const question = req.body.question as string;
    fs.readFile("src/documentation/features.txt", "utf8", async (error, data) => {
      if (error) {
        console.error("Error reading the file:", error);
        return;
      }
      if (question && question.length) {
        const openai = new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: "https://api.groq.com/openai/v1" });
        const aiModel = "llama-3.3-70b-versatile";

        const systemPrompt = [
          "You are a helpful assistant that helps users create tasks in a task management application.",
          "Your job is to extract task information from the user's message. If you can identify a task, respond with:",
          "1. A friendly confirmation of the task details",
          "2. The JSON data you're returning I'm trimming it out of the message that the user reads, so he is not seeing it",
          "If the user's message doesn't have enough information to create a task, just ask for the missing information",
          "in a friendly, conversational way. Don't mention JSON, backend, or technical terms.",
          "If the user doesn't appear to be asking about creating a task, respond appropriately without mentioning tasks.",
          "Keep your responses brief and friendly.",
          data
        ].join("\n");

        const messages: Message[] = [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: question,
          }
        ];

        const completion = await openai.chat.completions.create({
          model: aiModel,
          messages: messages,
        });

        const aiResponse = completion.choices[0].message;

        res.json({aiResponse})
      } else {
        res.json({ message: "No question"})
      }
    })
    
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
}