const express = require('express');
const BootcampModel = require('@/modules/bootcamp/models/Bootcamp');
const bootcamp = require('@/modules/bootcamp/controllers/BootcampController');
const validate = require('@/middlewares/validate');
const FormValidator = require('@/modules/bootcamp/validators/BootcampFormValidator');
const asyncHandler = require('@/middlewares/async');
const advancedResults = require('@/middlewares/advanced-results');
const { protect, authorize } = require('@/middlewares/auth');
const router = express.Router();

// Include other resource routers and then re-route into
// other resource routers
router.use('/:bootcampId/courses', require('./courses'));

router.get('/', [advancedResults(BootcampModel, 'courses')], asyncHandler(bootcamp.index));
router.get('/:id', asyncHandler(bootcamp.show));
router.get('/radius/:zipcode/:distance', asyncHandler(bootcamp.radius));
router.post('/', [protect, authorize('publisher', 'admin'), FormValidator, validate], asyncHandler(bootcamp.store));
router.put('/:id', [protect, authorize('publisher', 'admin'), FormValidator, validate], asyncHandler(bootcamp.update));
router.put('/:id/photo', [protect, authorize('publisher', 'admin')], asyncHandler(bootcamp.uploadPhoto));
router.delete('/:id', [protect, authorize('publisher', 'admin')], asyncHandler(bootcamp.destroy));

module.exports = router;
