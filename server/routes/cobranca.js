const express = require('express');
const CobrancaController = require('../controllers/cobrancaController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Rotas públicas (webhook)
router.post('/webhook', CobrancaController.webhook);

// Rotas protegidas (qualquer mapeador autenticado)
router.get('/meu-plano', authMiddleware, CobrancaController.getMinhaAssinatura);
router.post('/assinaturas', authMiddleware, CobrancaController.createAssinatura);

// Rotas admin
router.get('/planos', authMiddleware, adminMiddleware, CobrancaController.listPlanos);
router.get('/planos/:id', authMiddleware, adminMiddleware, CobrancaController.getPlano);
router.post('/planos', authMiddleware, adminMiddleware, CobrancaController.createPlano);
router.patch('/planos/:id', authMiddleware, adminMiddleware, CobrancaController.updatePlano);

router.get('/assinaturas', authMiddleware, adminMiddleware, CobrancaController.listAssinaturas);
router.get('/assinaturas/:id', authMiddleware, adminMiddleware, CobrancaController.getAssinatura);
router.post('/assinaturas/:id/cancelar', authMiddleware, adminMiddleware, CobrancaController.cancelAssinatura);

router.get('/pagamentos', authMiddleware, adminMiddleware, CobrancaController.listPagamentos);
router.get('/pagamentos/:id', authMiddleware, adminMiddleware, CobrancaController.getPagamento);
router.get('/assinaturas/:id/pagamentos', authMiddleware, adminMiddleware, CobrancaController.listPagamentosDaAssinatura);

router.get('/faturamento', authMiddleware, adminMiddleware, CobrancaController.getFaturamento);

module.exports = router;
