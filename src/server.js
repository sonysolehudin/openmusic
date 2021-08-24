/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable indent */
require('dotenv').config();
const jwt = require('@hapi/jwt');
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const path = require('path');
const auth = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const AuthenticationsValidator = require('./validator/authentications');
const CacheService = require('./services/redis/CacheService');
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportValidator = require('./validator/exports');
const collab = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');
const TokenManager = require('./tokenize/TokenManager');
const uploads = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const UploadValidator = require('./validator/uploads');
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

const init = async () => {
    const songsService = new SongsService();
    const cacheService = new CacheService();
    const collabService = new CollaborationsService(cacheService);
    const playlistsService = new PlaylistsService(collabService, cacheService);
    const usersService = new UsersService();
    const authService = new AuthenticationsService();
    const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));
    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });
    await server.register([
        {
            plugin: jwt,
        },
        {
            plugin: Inert,
        },
    ]);
    server.auth.strategy('songsapp_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            },
        }),
    });
    await server.register([
        {
            plugin: songs,
            options: {
                service: songsService,
                validator: SongsValidator,
            },
        },
        {
            plugin: playlists,
            options: {
                service: playlistsService,
                validator: PlaylistsValidator,
            },
        },
        {
            plugin: users,
            options: {
                service: usersService,
                validator: UsersValidator,
            },
        },
        {
            plugin: auth,
            options: {
                authService,
                usersService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator,
            },
        },
        {
            plugin: collab,
            options: {
                collabService,
                playlistsService,
                validator: CollaborationsValidator,
            },
        },
        {
            plugin: _exports,
            options: {
                service: ProducerService,
                validator: ExportValidator,
                playlistsService,
            },
        },
        {
            plugin: uploads,
            options: {
                service: storageService,
                validator: UploadValidator,
            },
        },
    ]);
    await server.start();
    console.log(`Server telah berjalan melalui ${server.info.uri}`);
};

init();
