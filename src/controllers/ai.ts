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

        const prompt = [];

        prompt.push(
          "Your job is to extract task information from the user's message. If the message contains a task, return a JSON object with the task fields"
        );
        prompt.push(
          "If the message doesn't have enough information to create a task, ask the user for more information acting as an assistant for the user."
        );
        prompt.push(
          "Do not use tecnical terms with the user such as JSON, Backend or Endpoint and things like that."
        );
        prompt.push(
          "You need to try to create the task with the least information you have, and be brief with the user"
        );
        prompt.push(data);

        const messages: Message[] = [
          {
            role: "system",
            content: prompt.join(" "),
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