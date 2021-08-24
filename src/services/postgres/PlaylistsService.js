/* eslint-disable linebreak-style */
/* eslint-disable lines-between-class-members */
/* eslint-disable linebreak-style */
/* eslint-disable object-curly-newline */
/* eslint-disable no-underscore-dangle */
/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable eol-last */

const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModel, mapDBToModelPlaylists } = require('../../utils');

class PlaylistsService {
    constructor(collaborationService, cacheService) {
        this._pool = new Pool();
        this._collaborationService = collaborationService;
        this._cacheService = cacheService;
    }

    async addPlaylist({ Id, name, owner }) {
        const id = `playlist-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        };
        const result = await this._pool.query(query);
        if (!result.rows[0].id) {
            throw new InvariantError('Playlist gagal ditambahkan');
        }
        await this._cacheService.delete(`playlists:${owner}-${Id}`);
        return result.rows[0].id;
    }

    async addSongToPlaylist(playlistId, songId) {
        const query = {
            text: 'INSERT INTO songsplaylists (playlist_id, song_id) VALUES($1, $2) RETURNING id',
            values: [playlistId, songId],
        };
        const result = await this._pool.query(query);
        if (!result.rows[0].id) {
            throw new InvariantError('Lagu gagal ditambahkan ke playlist');
        }
        await this._cacheService.delete(`songs:${playlistId}`);
    }

    async verifyPlaylistOwner(id, owner) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }
        const playlist = result.rows[0];
        if (playlist.owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }

    async verifyPlaylistAccess(playlistId, userId) {
        try {
            await this.verifyPlaylistOwner(playlistId, userId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            try {
                await this._collaborationService.verifyCollaborator(playlistId, userId);
            } catch {
                throw error;
            }
        }
    }

    async getUsersByUsername(username) {
        const query = {
            text: 'SELECT id, username, fullname FROM users WHERE username LIKE $1',
            values: [`%${username}%`],
        };
        const result = await this._pool.query(query);
        return result.rows;
    }

    async getPlaylists(Id) {
        try {
            const result = await this._cacheService.get(`playlists:${Id}`);
            return JSON.parse(result);
        } catch (error) {
            const query = {
                text: `SELECT playlists.id, playlists.name, users.username FROM playlists 
                LEFT JOIN users ON users.id = playlists.owner
                LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id  
                WHERE playlists.owner = $1 OR collaborations.user_id = $1
                GROUP BY playlists.id, users.username;`,
                values: [Id],
            };
            const result = await this._pool.query(query);
            const mappedResult = result.rows.map(mapDBToModelPlaylists);
            await this._cacheService.set(`playlists:${Id}`, JSON.stringify(mappedResult));
            return mappedResult;
        }
    }

    async getSongsFromPlaylist(playlistId) {
        try {
            const result = await this._cacheService.get(`songs:${playlistId}`);
            return JSON.parse(result);
        } catch (error) {
            const query = {
                text: `SELECT songs.id, songs.title, songs.performer
                FROM songs JOIN songsplaylists
                ON songs.id = songsplaylists.song_id WHERE songsplaylists.playlist_id = $1`,
                values: [playlistId],
            };
            const result = await this._pool.query(query);
            await this._cacheService.set(`songs:${playlistId}`, JSON.stringify(result.rows.map(mapDBToModel)));
            return result.rows;
        }
    }

    async deleteSongFromPlaylist(playlistId, songId) {
        const query = {
            text: 'DELETE FROM songsplaylists WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
            values: [playlistId, songId],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new InvariantError('Lagu gagal dihapus');
        }
        await this._cacheService.delete(`songs:${playlistId}`);
    }

    async deletePlaylistById(id) {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
            values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
        }
        await this._cacheService.delete(`playlists:${id}`);
    }
}
module.exports = PlaylistsService;