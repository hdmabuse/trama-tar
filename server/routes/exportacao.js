const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const ExportacaoService = require('../services/exportacaoService');

const router = express.Router({ mergeParams: true });
router.use(authMiddleware);

router.get('/csv', (req, res, next) => {
  try {
    res.json(ExportacaoService.toCSV(req.params.redeId, req.mapeador.id));
  } catch (err) {
    next(err);
  }
});

router.get('/markdown', (req, res, next) => {
  try {
    const md = ExportacaoService.toMarkdown(req.params.redeId, req.mapeador.id);
    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="relato-${req.params.redeId.slice(0, 8)}.md"`);
    res.send(md);
  } catch (err) {
    next(err);
  }
});

router.get('/json', (req, res, next) => {
  try {
    const data = ExportacaoService.toJSON(req.params.redeId, req.mapeador.id);
    res.setHeader('Content-Disposition', `attachment; filename="trama-tar-${req.params.redeId.slice(0, 8)}.json"`);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get('/graphml', (req, res, next) => {
  try {
    const graphml = ExportacaoService.toGraphML(req.params.redeId, req.mapeador.id);
    res.setHeader('Content-Type', 'application/graphml+xml; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="trama-tar-${req.params.redeId.slice(0, 8)}.graphml"`);
    res.send(graphml);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
