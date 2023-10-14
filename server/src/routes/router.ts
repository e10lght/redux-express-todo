import express from 'express';
import { getUser } from '../controllers/users.controller';
const router = express.Router();

router.get('/:user_id', getUser);

export default router;
