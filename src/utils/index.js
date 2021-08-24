/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
/* eslint-disable indent */
/* eslint-disable eol-last */
/* eslint-disable no-trailing-spaces */
/* eslint-disable object-curly-newline */
const mapDBToModel = ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    inserted_at,
    updated_at,
}) => ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    insertedAt: inserted_at,
    updatedAt: updated_at,
});

const mapDBToModelPlaylists = ({ id, name, username }) => ({
    id,
    name,
    username,
});

const mapDBToModelPlaylistSongs = ({ id, title, performer }) => ({
    id,
    title,
    performer,
});

module.exports = { mapDBToModel,
                    mapDBToModelPlaylists,
                    mapDBToModelPlaylistSongs,
                };