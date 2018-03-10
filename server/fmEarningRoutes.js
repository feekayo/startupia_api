'use strict';

let express = require('express'),
    router = express.Router(),
    controller = require('../controllers/fmEarning');
router.get('/',controller.findAll);
router.post('/',controller.create);
router.patch('/:earn_id',controller.update);
router.delete('/:earn_id',controller.delete);
//earn_id
module.exports = router;