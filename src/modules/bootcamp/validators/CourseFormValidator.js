const { checkSchema } = require('express-validator');
const SKILLS = require('@/modules/bootcamp/constants/skills');

module.exports = checkSchema({
  title: {
    trim: true,
    notEmpty: {
      errorMessage: 'Please add a course title',
    },
  },
  description: {
    notEmpty: {
      errorMessage: 'Please add a description',
    },
  },
  weeks: {
    notEmpty: {
      errorMessage: 'Please add number of weeks',
    },
  },
  tuition: {
    notEmpty: {
      errorMessage: 'Please add a tuition cost',
    },
  },
  minimumSkill: {
    notEmpty: {
      errorMessage: 'Please add a minimum skill',
    },
    isIn: {
      options: [SKILLS],
      errorMessage: `Please fill in with one of (${SKILLS.join(', ')})`,
    },
  },
});
