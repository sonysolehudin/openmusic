/* eslint-disable linebreak-style */
/* eslint-disable object-curly-newline */
/* eslint-disable no-underscore-dangle */
/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable eol-last */
/* eslint-disable no-trailing-spaces */
const ClientError = require('../../exceptions/ClientError');

class PlaylistsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
        this.postSongHandler = this.postSongHandler.bind(this);
        this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
        this.getSongsHandler = this.getSongsHandler.bind(this);
        this.getUserByUsernameHandler = this.getUserByUsernameHandler.bind(this);
        this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
        this.deleteSongsByIdHandler = this.deleteSongByIdHandler.bind(this);
    }

    async postPlaylistHandler(request, h) {
        try {
            this._validator.validatePostPlaylistPayload(request.payload);
            const { name } = request.payload;
            const { id: credentialId } = request.auth.credentials;
            const playlistId = await this._service.addPlaylist({
                name, owner: credentialId,
            });
            const response = h.response({
                status: 'success',
                message: 'Playlist berhasil ditambahkan',
                data: {
                    playlistId,
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

    async postSongHandler(request, h) {
        try {
            this._validator.validatePostSongPayload(request.payload);
            const { playlistId } = request.params;
            const { songId } = request.payload;
            const { id: credentialId } = request.auth.credentials;
            await this._service.verifyPlaylistAccess(playlistId, credentialId);
            await this._service.addSongToPlaylist(playlistId, songId);
            const response = h.response({
                status: 'success',
                message: 'Lagu berhasil ditambahkan ke playlist',
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

    async getPlaylistsHandler(request) {
        const { id: credentialId } = request.auth.credentials;
        const playlists = await this._service.getPlaylists(credentialId);
        return {
            status: 'success',
            data: {
                playlists,
            },
        };
    }

    async getSongsHandler(request, h) {
        try {
            const { playlistId } = request.params;
            const { id: credentialId } = request.auth.credentials;
            await this._service.verifyPlaylistAccess(playlistId, credentialId);
            const songs = await this._service.getSongsFromPlaylist(playlistId);
            return {
                status: 'success',
                data: {
                    songs,
                },
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

    async getUserByUsernameHandler(request, h) {
        try {
            const { username = '' } = request.query;
            const user = await this._service.getUsersByUsername(username);
            return {
                status: 'success',
                data: {
                    user,
                },
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

    async deletePlaylistByIdHandler(request, h) {
        try {
            const { playlistId } = request.params;
            const { id: credentialId } = request.auth.credentials;
            await this._service.verifyPlaylistOwner(playlistId, credentialId);
            await this._service.deletePlaylistById(playlistId);
            return {
                status: 'success',
                message: 'Playlist berhasil dihapus',
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

    async deleteSongByIdHandler(request, h) {
        try {
            const { playlistId } = request.params;
            const { songId } = request.payload;
            const { id: credentialId } = request.auth.credentials;
            await this._service.verifyPlaylistAccess(playlistId, credentialId);
            await this._service.deleteSongFromPlaylist(playlistId, songId);
            return {
                status: 'success',
                message: 'Lagu berhasil dihapus dari playlist',
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

module.exports = PlaylistsHandler;
