/* eslint-disable linebreak-style */
/* eslint-disable lines-between-class-members */
/* eslint-disable linebreak-style */
/* eslint-disable object-curly-newline */
/* eslint-disable no-underscore-dangle */
/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable eol-last */
/* eslint-disable no-trailing-spaces */

const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class AuthenticationsService {
    constructor() {
        this._pool = new Pool();
    }

    async addRefreshToken(tokenData) {
        const query = {
            text: 'INSERT INTO authentications VALUES($1)',
            values: [tokenData],
        };
        await this._pool.query(query);
    }

    async verifyRefreshToken(tokenData) {
        const query = {
            text: 'SELECT token FROM authentications WHERE token = $1',
            values: [tokenData],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new InvariantError('Refresh token tidak valid');
        }
    }

    async deleteRefreshToken(tokenData) {
        await this.verifyRefreshToken(tokenData);
        const query = {
            text: 'DELETE FROM authentications WHERE token = $1',
            values: [tokenData],
        };
        await this._pool.query(query);
    }
}

module.exports = AuthenticationsService;