const express = require('express');
const { ActanteController, AssociacaoController } = require('../controllers/actanteController');
const { authMiddleware } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { checkRedeExists } = require('../middleware/checkRede');

const router = express.Router({ mergeParams: true });
router.use(authMiddleware);
router.use(checkRedeExists('redeId'));

router.get('/', ActanteController.list);
router.post('/', validate(schemas.actante), ActanteController.create);
router.patch('/:id', ActanteController.update);
router.delete('/:id', ActanteController.delete);

const assocRouter = express.Router({ mergeParams: true });
assocRouter.use(authMiddleware);
assocRouter.use(checkRedeExists('redeId'));

assocRouter.get('/', AssociacaoController.list);
assocRouter.post('/', validate(schemas.associacao), AssociacaoController.create);
assocRouter.patch('/:id', AssociacaoController.update);
assocRouter.delete('/:id', AssociacaoController.delete);

module.exports = { actantesRouter: router, associacoesRouter: assocRouter };