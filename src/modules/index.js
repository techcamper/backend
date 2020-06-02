module.exports = app => {
  app.use('/api/v1/bootcamps', require('./bootcamp/routes/bootcamps'));
  app.use('/api/v1/courses', require('./bootcamp/routes/courses'));
  app.use('/api/v1/auth', require('./user/routes/auth'));
};
