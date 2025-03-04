import express from 'express';
import { isAuthenticated } from '../middlewares';
import { getAIResponse } from '../controllers/ai';

export default (router: express.Router) => {
  router.get('/habot', isAuthenticated, getAIResponse);
}