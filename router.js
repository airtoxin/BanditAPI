var express = require('express');
var requireDir = require('require-dir');

var router = express.Router();
var api = requireDir('./api');

router.post('/create', api.create);
router.get('/status', api.status);
router.delete('/delete', api.delete);
router.get('/get', api.get);

module.exports = router;
