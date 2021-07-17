/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable eol-last */
/* eslint-disable no-trailing-spaces */
const Joi = require('joi');

const SongPayloadSchema = Joi.object({
    title: Joi.string().required(),
    year: Joi.number().integer().required(),
    performer: Joi.string().required(),
    genre: Joi.string(),
    duration: Joi.number(),
});

module.exports = { SongPayloadSchema };