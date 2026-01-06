import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getCategories,
} from '../controllers/equipmentController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Configurar multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/equipments');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'),
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas'));
    }
  },
});

// Rotas públicas (com autenticação)
router.get('/', authenticateToken, getAllEquipment);
router.get('/categories', authenticateToken, getCategories);
router.get('/:id', authenticateToken, getEquipmentById);

// Rotas restritas (apenas instrutores e admins)
router.post(
  '/',
  authenticateToken,
  authorizeRole('INSTRUCTOR', 'ADMIN'),
  upload.single('image'),
  createEquipment
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole('INSTRUCTOR', 'ADMIN'),
  updateEquipment
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole('INSTRUCTOR', 'ADMIN'),
  deleteEquipment
);

export default router;
