import express from 'express';
import {
  createUserHandler,
  deleteUserHandler,
  getUserHandler,
  updateUserHandler
} from '../controllers/users.controller';

const router = express.Router();

router.get('/:user_id', getUserHandler);
router.post('/user/create', createUserHandler);
router.put('/user/update/:user_id', updateUserHandler);
router.delete('/user/delete/:user_id', deleteUserHandler);

export default router;
