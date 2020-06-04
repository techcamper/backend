const express = require('express');
const CourseModel = require('@/modules/bootcamp/models/Course');
const course = require('@/modules/bootcamp/controllers/CourseController');
const validate = require('@/middlewares/validate');
const FormValidator = require('@/modules/bootcamp/validators/CourseFormValidator');
const asyncHandler = require('@/middlewares/async');
const advancedResults = require('@/middlewares/advanced-results');
const { protect, authorize } = require('@/middlewares/auth');
const router = express.Router({ mergeParams: true });

router.get('/', [advancedResults(CourseModel, {
  path: 'bootcamp',
  select: 'name description',
})], asyncHandler(course.index));
router.get('/:id', asyncHandler(course.show));
router.post('/', [protect, authorize('publisher', 'admin'), FormValidator, validate], asyncHandler(course.store));
router.put('/:id', [protect, authorize('publisher', 'admin'), FormValidator, validate], asyncHandler(course.update));
router.delete('/:id', [protect, authorize('publisher', 'admin')], asyncHandler(course.destroy));

module.exports = router;
