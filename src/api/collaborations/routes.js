/* eslint-disable linebreak-style */
/* eslint-disable indent */
const routes = (handler) => [
    {
        method: 'POST',
        path: '/collaborations',
        handler: handler.postCollabHandler,
        options: {
            auth: 'songsapp_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/collaborations',
        handler: handler.deleteCollabHandler,
        options: {
            auth: 'songsapp_jwt',
        },
    },
];

module.exports = routes;
