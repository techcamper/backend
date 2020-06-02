const path = require('path');
const ErrorResponse = require('@/utils/ErrorResponse');
const geocoder = require('@/services/geocoder');
const Bootcamp = require('@/modules/bootcamp/models/Bootcamp');

module.exports = {
  /**
   * @desc     Get all bootcamps
   * @route    GET /api/v1/bootcamps
   * @access   Public
   */
  async index(req, res) {
    res.status(200).json(res.advancedResults);
  },

  /**
   * @desc     Get single bootcamp
   * @route    GET /api/v1/bootcamps/:id
   * @access   Public
   */
  async show(req, res, next) {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: bootcamp });
  },

  /**
   * @desc     Create new bootcamp
   * @route    POST /api/v1/bootcamps
   * @access   Private
   */
  async store(req, res) {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  },

  /**
   * @desc     Update bootcamp
   * @route    PUT /api/v1/bootcamps/:id
   * @access   Private
   */
  async update(req, res) {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: bootcamp });
  },

  /**
   * @desc     Delete bootcamp
   * @route    DELETE /api/v1/bootcamps/:id
   * @access   Private
   */
  async destroy(req, res, next) {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
      );
    }

    await bootcamp.remove();

    res.status(200).json({ success: true, data: {} });
  },

  /**
   * @desc     Get bootcamps within a radius
   * @route    GET /api/v1/bootcamps/radius/:zipcode/:distance
   * @access   Private
   */
  async radius(req, res) {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide distance by radius of Earth
    // Earth Radius = 3,963 miles / 6,378 Km
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });

    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
    });
  },

  /**
   * @desc     Upload photo for bootcamp
   * @route    PUT /api/v1/bootcamps/:id/photo
   * @access   Private
   */
  async uploadPhoto(req, res, next) {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
      );
    }

    if (!req.files) {
      return next(new ErrorResponse('Please upload a file', 400));
    }

    const { file } = req.files;

    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
      return next(new ErrorResponse('Please upload an image file', 400));
    }

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400)
      );
    }

    // Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse('Problem with file upload', 500));
      }

      await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

      res.status(200).json({
        success: true,
        data: file.name
      });
    });
  },
};