import { Request, Response } from "express";

import { deleteUserById, getUserById, getUsers } from "../db/users";

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getUsers();

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.sendStatus(400)    
  }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteUserById(id);

    res.json(deletedUser);
    return;
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
    return;
  }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
      res.sendStatus(400);
    }

    const user = await getUserById(id);

    user.username = username;
    await user.save();

    res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);    
  }
}