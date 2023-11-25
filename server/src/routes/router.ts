import express from 'express';
import { loginHandler, logoutHandler } from '../controllers/auth.controller';
import {
  createTaskHandler,
  deleteTaskHandler,
  getTaskHandler,
  updateTaskHandler
} from '../controllers/tasks.controller';
import {
  createUserHandler,
  deleteUserHandler,
  getUserHandler,
  updateUserHandler
} from '../controllers/users.controller';

const router = express.Router();

router.get('/user/list', getUserHandler);
router.post('/user/create', createUserHandler);
router.put('/user/update/:user_id', updateUserHandler);
router.delete('/user/delete/:user_id', deleteUserHandler);

router.get('/task/list', getTaskHandler);
router.post('/task/create', createTaskHandler);
router.put('/task/update/:task_id', updateTaskHandler);
router.delete('/task/delete/:task_id', deleteTaskHandler);

router.get('/logout', logoutHandler);
router.post('/login', loginHandler);

export default router;
