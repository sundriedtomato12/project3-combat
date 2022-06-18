import db from './models/index.mjs';

import { resolve } from 'path';

export default function bindRoutes(app) {

  app.get('/', (request, response) => {
    response.render('main');
  });
}
