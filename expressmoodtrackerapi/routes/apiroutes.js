const express = require('express');
const controller = require('./../controllers/apicontroller');
const router = express.Router();

router.get('/', controller.getFavourites);
router.get('/:id', controller.getFavourite);

router.post('/', controller.insertFavourite);

router.put('/:id', controller.updateFavourite);

router.delete('/:id', controller.deleteFavourite);

module.exports = router;