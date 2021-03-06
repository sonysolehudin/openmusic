/* eslint-disable linebreak-style */
/* eslint-disable object-curly-newline */
/* eslint-disable no-underscore-dangle */
/* eslint-disable indent */
/* eslint-disable eol-last */
/* eslint-disable no-trailing-spaces */
const ClientError = require('../../exceptions/ClientError');

class UploadHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request, h) {
    try {
      const { data } = request.payload;
      this._validator.validateImageHeader(data.hapi.headers);
      const fileName = await this._service.writeFile(data, data.hapi);
      const response = h.response({
        status: 'success',
        message: 'Gambar berhasil diunggah',
        data: {
            pictureUrl: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${fileName}`,
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
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = UploadHandler;