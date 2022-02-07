import { ConnectionOptions } from 'typeorm';

export const config: ConnectionOptions = {
  url: 'postgres://ilkggnuz:jzU5N6V_cs63YZaDcyrmgk1d5Y_JlEKl@abul.db.elephantsql.com/ilkggnuz',
  type: 'postgres',
  host: 'abul.db.elephantsql.com (abul-01)',
  port: 5432,
  username: 'ilkggnuz',
  database: 'ilkggnuz',
  password: 'jzU5N6V_cs63YZaDcyrmgk1d5Y_JlEKl',
  entities: ['dist/infra/postgres/entities/index.js'],
};
