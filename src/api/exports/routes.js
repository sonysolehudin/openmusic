/* eslint-disable linebreak-style */
/* eslint-disable indent */
const routes = (handler) => [
    {
      method: 'POST',
      path: '/exports/playlists/{playlistId}',
      handler: handler.postExportSongsHandler,
      options: {
        auth: 'songsapp_jwt',
      },
    },
];

module.exports = routes;
