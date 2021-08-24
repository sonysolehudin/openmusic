/* eslint-disable linebreak-style */
/* eslint-disable object-curly-newline */
/* eslint-disable no-underscore-dangle */
/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable eol-last */
/* eslint-disable no-trailing-spaces */
const ClientError = require('../../exceptions/ClientError');

class UsersHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postUsersHandler = this.postUsersHandler.bind(this);
        this.getUsersByIdHandler = this.getUsersByIdHandler.bind(this);    
    }

    async postUsersHandler(request, h) {
        try {
            this._validator.validateUserPayload(request.payload);
            const { username, password, fullname } = request.payload;
            const userId = await this._service.addUser({ 
                username,
                password,
                fullname, 
            });
            const response = h.response({
                status: 'success',
                message: 'User berhasil ditambahkan',
                data: {
                    userId,
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

    async getUsersByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const user = await this._service.getUserById(id);
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
                message: 'Maaf, terjadsi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }
}

module.exports = UsersHandler;
