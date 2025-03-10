import { get } from 'lodash';
import { createTask, getTasks } from '../db/tasks';
import { Request, Response } from 'express';

export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = get(req, 'identity._id') as string;
    const tasks = await getTasks(currentUserId);
    
    res.status(200).json(tasks);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
}

export const createNewTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = get(req, "identity._id") as string;
    const values = req.body;
    console.log('values', values);
    if (!values.title) res.status(400).json({error: 'Title is required'}).end()
    

    const newTask =  await createTask(values, currentUserId);
    res.status(200).json(newTask).end();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
}