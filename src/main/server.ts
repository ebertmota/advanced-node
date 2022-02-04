/* eslint-disable no-console */
import 'reflect-metadata';
import { env } from './config';
import { app } from './config/app';

import './config/module.alias';

app.listen(env.appPort, () =>
  console.log(`Sever running at http://localhost:${env.appPort}`),
);
