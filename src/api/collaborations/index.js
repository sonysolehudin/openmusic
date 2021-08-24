/* eslint-disable linebreak-style */
/* eslint-disable indent */
const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'collaborations',
    version: '1.0.0',
    register: async (server, { collabService, songsService, validator }) => {
        const collabHandler = new CollaborationsHandler(
            collabService, songsService, validator,
        );
        server.route(routes(collabHandler));
    },
};
