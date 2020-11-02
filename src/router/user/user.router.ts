import {Router} from 'express';
import {userController} from '../../controller/user';
import {userMiddleware} from '../../middleware/user';

const router = Router();

router.post('/',userMiddleware.validateUser, userController.createUser);

export const userRouter = router;
