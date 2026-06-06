const express = require('express');
const AdminController = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware, adminMiddleware);

router.get('/mapeadores', AdminController.listMapeadores);
router.get('/mapeadores/:id', AdminController.getMapeador);
router.patch('/mapeadores/:id', AdminController.updateMapeador);
router.delete('/mapeadores/:id', AdminController.deleteMapeador);

router.get('/audit-log', AdminController.listAuditLog);
router.get('/metrics', AdminController.getMetrics);
router.get('/db-info', AdminController.getDBInfo);
router.get('/config', AdminController.getConfig);
router.post('/config', AdminController.upsertConfig);

module.exports = router;
