/* eslint-disable linebreak-style */
/* eslint-disable indent */
const routes = (handler) => [
    {
        method: 'POST',
        path: '/users',
        handler: handler.postUsersHandler,
    },
    {
        method: 'GET',
        path: '/users/{id}',
        handler: handler.getUsersByIdHandler,
    },
];

module.exports = routes;
