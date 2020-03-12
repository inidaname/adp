import express, { Router } from 'express';
import { admin } from '../controller';

const routes: Router = express.Router();

routes.all('/', function(req, res) {
  res.status(200).json({ message: `You are on Admin Service ADP` });
});

routes.route('/admin').post(admin.createAdmin);
routes
  .route('/admin/:id')
  .get(admin.getAdminByUserId)
  .put(admin.updateAdmin)
  .delete(admin.deactivateAdmin);

export default routes;
