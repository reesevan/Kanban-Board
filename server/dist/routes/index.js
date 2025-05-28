// src/routes/index.ts
import { Router } from 'express';
import { authRouter } from './auth-routes.js';
import apiRoutes from './api/index.js';
const router = Router();
// Mount auth routes
router.use('/auth', authRouter);
// Mount API routes
router.use('/api', apiRoutes);
export default router;
