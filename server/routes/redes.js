const express = require('express');
const RedeController = require('../controllers/redeController');
const { authMiddleware } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();
router.use(authMiddleware);

router.get('/', RedeController.list);
router.post('/', validate(schemas.rede), RedeController.create);
router.get('/:id', RedeController.get);
router.patch('/:id', RedeController.update);
router.delete('/:id', RedeController.delete);

module.exports = router;