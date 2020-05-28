const mongoose = require('mongoose');

const connectDB = async () => {
  const connStr = process.env.MONGO_URI;
  const conn = await mongoose.connect(connStr, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  });

  console.log(
    `MongoDB Connected at ${conn.connection.host}`.cyan.underline.bold
  );
};

module.exports = connectDB;