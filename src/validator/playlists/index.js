/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable eol-last */
/* eslint-disable no-trailing-spaces */

const InvariantError = require('../../exceptions/InvariantError');
const { PostPlaylistPayloadSchema, PostSongPayloadSchema } = require('./schema');

const PlaylistsValidator = {
    validatePostPlaylistPayload: (payload) => {
        const validationResult = PostPlaylistPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
    validatePostSongPayload: (payload) => {
        const validationResult = PostSongPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};
module.exports = PlaylistsValidator;