/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns("layers", {
        parent_group: { type: 'string'}
    })
};
