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
          "You are a compny's support specialist available to answer any question. Only answer from the following company details and nothing else."
        );
        prompt.push("Politely decline if the question does not match the following:");
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

        const aiResponse = completion.choices[0].message.content;

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