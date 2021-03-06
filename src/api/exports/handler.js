/* eslint-disable linebreak-style */
/* eslint-disable object-curly-newline */
/* eslint-disable no-underscore-dangle */
/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable eol-last */
/* eslint-disable no-trailing-spaces */
const ClientError = require('../../exceptions/ClientError');

class ExportHandler {
  constructor(service, validator, playlistsService) {
    this._service = service;
    this._validator = validator;
    this._playlistsService = playlistsService;
    this.postExportSongsHandler = this.postExportSongsHandler.bind(this);
  }

  async postExportSongsHandler(request, h) {
    try {
      this._validator.validateExportSongPayload(request.payload);
      const { playlistId } = request.params;
      const { id: userId } = request.auth.credentials;
      await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
      const message = {
        playlistId,
        targetEmail: request.payload.targetEmail,
      };
      await this._service.sendMessage('export:songs', JSON.stringify(message));
      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
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
            message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = ExportHandler;