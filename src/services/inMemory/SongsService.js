/* eslint-disable linebreak-style */
/* eslint-disable object-curly-newline */
/* eslint-disable linebreak-style */
/* eslint-disable lines-between-class-members */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable linebreak-style */
/* eslint-disable indent */
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
    constructor() {
        this._songs = [];
    }

    addSong({ title, year, performer, genre, duration }) {
        const id = nanoid(16);
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;
        const newSong = {
            title, year, performer, genre, duration, id, insertedAt, updatedAt,
        };
        this._songs.push(newSong);
        const isSuccess = this._songs.filter((song) => song.id === id).length > 0;
        if (isSuccess) {
            throw new InvariantError('Lagu gagal ditambahkan');
        }
        return id;
    }
    getSongs() {
        return this._songs;
    }
    getSongById(id) {
        const song = this._songs.filter((num) => num.id === id)[0];
        if (!song) {
            throw new NotFoundError('Lagu tidak ditemukan');
        }
        return song;
    }
    editSongById(id, { title, year, performer, genre, duration }) {
        const edit = this._songs.findIndex((song) => song.id === id);
        if (edit === -1) {
            throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
        }
        const updatedAt = new Date().toISOString();
        this._songs[edit] = {
            ...this._songs[edit],
            title,
            year,
            performer,
            genre,
            duration,
            updatedAt,
        };
    }
    deleteSongById(id) {
        const file = this._songs.findIndex((song) => song.id === id);
        if (file === -1) {
            throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
        }
        this._songs.splice(file, 1);
    }
}

module.exports = SongsService;
