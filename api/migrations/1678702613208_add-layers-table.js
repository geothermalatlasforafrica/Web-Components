/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable("layers", {
        id: "id",
        name: { type: 'string', notNull: true, unique: true },
        full_name: { type: 'string', notNull: true, unique: true },
        filename: { type: 'string', notNull: true, unique: true },
        type: { type: 'string', notNull: true, unique: true },
        url: { type: 'string', notNull: true, unique: true },
        unit: { type: 'string', notNull: true, unique: true },
        workspace: { type: 'string', notNull: true, unique: true },
        email: { type: 'string', notNull: true, unique: true }
    })
};
