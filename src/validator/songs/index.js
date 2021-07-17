/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable eol-last */
/* eslint-disable no-trailing-spaces */
const InvariantError = require('../../exceptions/InvariantError');
const { SongPayloadSchema } = require('./schema');

const SongsValidator = {
    validateSongPayload: (payload) => {
        const resultValidator = SongPayloadSchema.validate(payload);
        if (resultValidator.error) {
            throw new InvariantError(resultValidator.error.message);
        }
    },
};

module.exports = SongsValidator;