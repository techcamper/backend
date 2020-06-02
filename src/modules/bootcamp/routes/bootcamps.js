const express = require('express');
const BootcampModel = require('@/modules/bootcamp/models/Bootcamp');
const bootcamp = require('@/modules/bootcamp/controllers/BootcampController');
const validate = require('@/middlewares/validate');
const FormValidator = require('@/modules/bootcamp/validators/BootcampFormValidator');
const asyncHandler = require('@/middlewares/async');
const advancedResults = require('@/middlewares/advanced-results');
const router = express.Router();

// Include other resource routers and then re-route into
// other resource routers
router.use('/:bootcampId/courses', require('./courses'));

router.get('/', [advancedResults(BootcampModel, 'courses')], asyncHandler(bootcamp.index));
router.get('/:id', asyncHandler(bootcamp.show));
router.get('/radius/:zipcode/:distance', asyncHandler(bootcamp.radius));
router.post('/', [FormValidator, validate], asyncHandler(bootcamp.store));
router.put('/:id', [FormValidator, validate], asyncHandler(bootcamp.update));
router.put('/:id/photo', asyncHandler(bootcamp.uploadPhoto));
router.delete('/:id', asyncHandler(bootcamp.destroy));

module.exports = router;
