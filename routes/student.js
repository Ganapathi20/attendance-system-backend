const controller = require('../controllers/student');
const router = require("express").Router();

router.use('/:id', controller.getStudent); 

module.exports = router;