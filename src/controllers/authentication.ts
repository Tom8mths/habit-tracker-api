import { Request, Response } from 'express';

import { authentication, random } from '../helpers';
import { createUser, getUserByEmail } from "../db/users";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.sendStatus(400);
      return;
    }

    const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
    console.log('user', user);
    
    if (!user) {
      res.sendStatus(400);
      return;
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password !== expectedHash) {
      res.sendStatus(403);
      return;
    }

    const salt = random();
    user.authentication.sessionToken = authentication(salt, user._id.toString());

    await user.save();

    res.cookie('TOMATE-AUTH', user.authentication.sessionToken, { httpOnly: true, domain: 'localhost', path: '/'});

    res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      res.sendStatus(400)
      return;
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      res.sendStatus(400)
      return;
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password)
      }
    });

    res.status(200).json(user).end()
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
}