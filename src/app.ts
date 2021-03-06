import * as express from 'express';
import {NextFunction, Request, Response} from 'express';
import * as cors from 'cors';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import * as dotenv from 'dotenv';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import {resolve} from 'path';
import * as swaggerUI from 'swagger-ui-express';
import * as fileupload from 'express-fileupload';
import {initialize} from 'passport';
import {config} from './config';
import * as swaggerDoc from './docs/swagger.json';
import {ResponseStatusCodeEnum} from './constant';
import {
  adminRouter,
  authRouter,
  cartRouter,
  gameCommentRouter,
  gameCredentialRouter,
  gameRouter, orderRouter,
  userRouter
} from './router';
import './helper/auth-strategies/auth-strategies';

dotenv.config();

const serverRequestLimit = rateLimit({
  windowMs: config.serverRateLimits.period,
  max: config.serverRateLimits.maxRequests
});

class App {
    public readonly app: express.Application = express();

    constructor() {
      this.app.use(fileupload({}));
      (global as any).appRoot = `${process.cwd()}/src`;
      this.app.use(morgan('dev'));
      this.app.use(initialize());
      this.app.use(helmet());
      this.app.use(serverRequestLimit);
      this.app.use(cors({
        origin: this.configureCors
      }));
      this.app.use(express.json());
      this.app.use(express.urlencoded({extended: true}));

      this.app.use(express.static(resolve(`${process.cwd()}/src`, 'public')));

      this.mountRoutes();
      this.setupDB();

      this.app.use(this.customErrorHandler);

    }

    private setupDB(): void {
      mongoose.connect(config.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true});

      mongoose.connection.on('error', console.log.bind(console, 'MONGO ERRROR'));
    }

    private customErrorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
      res
        .status(err.status || ResponseStatusCodeEnum.SERVER_ERROR)
        .json({
          message: err.message || 'Unknown Error',
          code: err.code
        });
    }

    private configureCors = (origin: any, callback: any) => {
      const whiteList = config.ALLOWED_ORIGIN.split(';');

      if (!origin) { // FOR POSTMAN
        return callback(null, true);
      }

      if (!whiteList.includes(origin)) {
        return callback(new Error('Cors not allowed'), false);
      }

      return callback(null, true);
    };

    private mountRoutes(): void {

      this.app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
      this.app.use('/users', userRouter);
      this.app.use('/auth', authRouter);
      this.app.use('/admin', adminRouter);
      this.app.use('/games', gameRouter);
      this.app.use('/credentials', gameCredentialRouter);
      this.app.use('/comments', gameCommentRouter);
      this.app.use('/cart', cartRouter);
      this.app.use('/orders', orderRouter);
    }
}

export const app = new App().app;
