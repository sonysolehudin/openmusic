/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable eol-last */
/* eslint-disable no-trailing-spaces */

const Joi = require('joi');

const PostPlaylistPayloadSchema = Joi.object({
    name: Joi.string().required(),
});
const PostSongPayloadSchema = Joi.object({
    songId: Joi.string().required(),
});
module.exports = { 
    PostPlaylistPayloadSchema,
    PostSongPayloadSchema,
};