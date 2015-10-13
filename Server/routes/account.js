var express = require('express');
var mongoose= require('mongoose');
var router = express.Router();

authenticate = require('../dbops/account');

router.post('/register', authenticate.reg);

module.exports = router;