/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable eol-last */
/* eslint-disable no-trailing-spaces */
const InvariantError = require('../../exceptions/InvariantError');
const { ImageHeaderSchema } = require('./schema');

const UploadValidator = {
  validateImageHeader: (header) => {
    const validationResult = ImageHeaderSchema.validate(header);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UploadValidator;