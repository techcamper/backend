const Bootcamp = require('@/modules/bootcamp/models/Bootcamp');
const Course = require('@/modules/bootcamp/models/Course');
const ErrorResponse = require('@/utils/ErrorResponse');

module.exports = {
  /**
   * @desc     Get courses
   * @route    GET /api/v1/courses
   * @route    GET /api/v1/bootcamps/:bootcampId/courses
   * @access   Public
   */
  async index(req, res) {
    if (req.params.bootcampId) {
      const courses = await Course.find({ bootcamp: req.params.bootcampId });

      return res.status(200).json({
        success: true,
        count: courses.length,
        data: courses,
      });
    }

    res.status(200).json(res.advancedResults);
  },

  /**
   * @desc     Get single course
   * @route    GET /api/v1/courses/:id
   * @access   Public
   */
  async show(req, res, next) {
    const course = await Course.findById(req.params.id).populate({
      path: 'bootcamp',
      select: 'name description',
    });

    if (!course) {
      return next(
        new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  },

  /**
   * @desc     Create new course
   * @route    POST /api/v1/bootcamps/:bootcampId/courses
   * @access   Private
   */
  async store(req, res, next) {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `Resource not found with id of ${req.params.bootcampId}`
        ),
        404
      );
    }

    // Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`,
          401
        )
      );
    }

    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      data: course,
    });
  },

  /**
   * @desc     Update course
   * @route    PUT /api/v1/courses/:id
   * @access   Private
   */
  async update(req, res, next) {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return next(
        new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is course owner
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update course ${course._id}`,
          401
        )
      );
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: course,
    });
  },

  /**
   * @desc     Delete course
   * @route    DELETE /api/v1/courses/:id
   * @access   Private
   */
  async destroy(req, res, next) {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(
        new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is course owner
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete course ${course._id}`,
          401
        )
      );
    }

    await course.remove();

    res.status(200).json({
      status: true,
      data: {},
    });
  },
};
