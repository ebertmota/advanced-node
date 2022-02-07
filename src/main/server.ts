/* eslint-disable no-console */
import 'reflect-metadata';
import { createConnection } from 'typeorm';

import { env } from './config';
import { app } from './config/app';
import { config } from '../infra/postgres/helpers';

import './config/module.alias';

createConnection(config)
  .then(() => {
    app.listen(env.appPort, () =>
      console.log(`Sever running at http://localhost:${env.appPort}`),
    );
  })
  .catch(console.error);
