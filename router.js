var express = require('express');
var requireDir = require('require-dir');

var router = express.Router();
var api = requireDir('./api');

router.post('/create', api.create);

module.exports = router;
