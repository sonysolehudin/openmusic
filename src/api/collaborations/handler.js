/* eslint-disable linebreak-style */
/* eslint-disable spaced-comment */
/* eslint-disable object-curly-newline */
/* eslint-disable no-underscore-dangle */
/* eslint-disable indent */
/* eslint-disable eol-last */
/* eslint-disable no-trailing-spaces */
const ClientError = require('../../exceptions/ClientError');

class CollaborationsHandler {
    constructor(collabService, playlistsService, validator) {
        this._collabService = collabService;
        //this._songsService = songsService;
        this._playlistsService = playlistsService;
        this._validator = validator;
        this.postCollabHandler = this.postCollabHandler.bind(this);
        this.deleteCollabHandler = this.deleteCollabHandler.bind(this);
    }

    async postCollabHandler(request, h) {
        try {
            this._validator.validateCollaborationPayload(request.payload);
            const { id: idCredential } = request.auth.credentials;
            const { playlistsId, userId } = request.payload;
            await this._playlistsService.verifyPlaylistOwner(playlistsId, idCredential);
            //await this._songsService.verifySongOwner(songId, idCredential);
            const idCollab = await this._collabService.addCollaboration(playlistsId, userId);
            const response = h.response({
                status: 'success',
                message: 'Kolaborasi berhasil ditambahkan',
                data: {
                    idCollab,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadsi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async deleteCollabHandler(request, h) {
        try {
            this._validator.validateCollaborationPayload(request.payload);
            const { id: idCredential } = request.auth.credentials;
            const { playlistsId, userId } = request.payload;
            await this._playlistsService.verifyPlaylistOwner(playlistsId, idCredential);
            //await this._songsService.verifySongOwner(songId, idCredential);
            await this._collabService.deleteCollaboration(playlistsId, userId);
            return {
                status: 'success',
                message: 'Kolaborasi berhasil dihapus',
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }
}

module.exports = CollaborationsHandler;
