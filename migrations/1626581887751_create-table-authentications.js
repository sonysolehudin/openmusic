/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('authentications', {
      token: {
        type: 'TEXT',
        notNull: true,
      },
    });
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('authentications');
  };
