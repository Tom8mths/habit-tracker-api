import { Request, Response, NextFunction } from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";
import { TaskModel } from "../db/tasks";

export const isOwner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, 'identity._id') as string;

    if (!currentUserId) {
      res.sendStatus(403);
      return;
    }

    if (currentUserId.toString() !== id) {
      res.sendStatus(403);
      return;
    }

    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(400)
    return;
  }
}

export const isTaskOwner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;

    if (!currentUserId) {
      res.sendStatus(403);
      return;
    }

    const task = await TaskModel.findById(id);

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    if (task.userId.toString() !== currentUserId) {
      res.sendStatus(403);
      return;
    }

    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('foi1');
    const sessionToken = req.cookies['TOMATE-AUTH'];
    if (!sessionToken) {
      res.status(403).json({message: "User not authenticated"}).end();
      return;   
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      res.sendStatus(403);
      return;
    }

    merge(req, { identity: existingUser});

    return next();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
    return;   
  }
}
