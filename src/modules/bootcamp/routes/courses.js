const express = require('express');
const CourseModel = require('@/modules/bootcamp/models/Course');
const course = require('@/modules/bootcamp/controllers/CourseController');
const validate = require('@/middlewares/validate');
const FormValidator = require('@/modules/bootcamp/validators/CourseFormValidator');
const asyncHandler = require('@/middlewares/async');
const advancedResults = require('@/middlewares/advanced-results');
const router = express.Router({ mergeParams: true });

router.get('/', [advancedResults(CourseModel, {
  path: 'bootcamp',
  select: 'name description',
})], asyncHandler(course.index));
router.get('/:id', asyncHandler(course.show));
router.post('/', [FormValidator, validate], asyncHandler(course.store));
router.put('/:id', [FormValidator, validate], asyncHandler(course.update));
router.delete('/:id', asyncHandler(course.destroy));

module.exports = router;
