module.exports = app => {
  app.use('/api/v1/bootcamps', require('./bootcamp/routes/bootcamps'));
  app.use('/api/v1/courses', require('./bootcamp/routes/courses'));
};
