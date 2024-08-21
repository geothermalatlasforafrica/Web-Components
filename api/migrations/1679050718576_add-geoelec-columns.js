/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns("layers", {
        group: { type: 'string'},
        description: { type: 'string'},
        keywords: { type: 'string'},
        date: { type: 'string'},
        restricted: { type: 'string'},
        resolution: { type: 'string'}
    })
};
