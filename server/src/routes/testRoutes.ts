import { Router } from 'express';
import {
  createStandardTest,
  getStandardTests,
  getTestById,
  submitTestResult,
  getUserResults,
  getAllResults,
} from '../controllers/testController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Rotas para todos usuários autenticados
router.get('/', authenticateToken, getStandardTests);
router.get('/:id', authenticateToken, getTestById);
router.post('/results', authenticateToken, submitTestResult);
router.get('/results/me', authenticateToken, getUserResults);

// Rotas apenas para instrutores e admins
router.post(
  '/',
  authenticateToken,
  authorizeRole('INSTRUCTOR', 'ADMIN'),
  createStandardTest
);

router.get(
  '/results/all',
  authenticateToken,
  authorizeRole('INSTRUCTOR', 'ADMIN'),
  getAllResults
);

export default router;
