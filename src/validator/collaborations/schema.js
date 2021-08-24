/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable eol-last */
/* eslint-disable no-trailing-spaces */

const Joi = require('joi');

const CollaborationPayloadSchema = Joi.object({
    songId: Joi.string().required(),
    userId: Joi.string().required(),
});
module.exports = { CollaborationPayloadSchema };