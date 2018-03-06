'use strict';

let express = require('express'),
    router = express.Router(),
    controller = require('../controllers/fmExpenditure');
router.get('/',controller.findAll);
router.post('/',controller.create);
router.patch('/:expend_id',controller.update);
router.delete('/:expend_id',controller.delete);
//expend_id
module.exports = router;