import { Request, Response } from "express";

import { deleteUserById, getUsers } from "../db/users";

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