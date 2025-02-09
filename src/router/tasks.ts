import { createNewTask, getAllTasks } from '../controllers/tasks';
import express from 'express';
import { isAuthenticated, isTaskOwner } from '../middlewares';

export default (router: express.Router) => {
  router.get('/tasks', isAuthenticated, getAllTasks);
  router.post('/tasks', isAuthenticated, createNewTask);
}