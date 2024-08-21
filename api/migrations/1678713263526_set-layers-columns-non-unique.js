/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.dropConstraint("layers", "layers_filename_key");
    pgm.dropConstraint("layers", "layers_full_name_key");
    pgm.dropConstraint("layers", "layers_name_key");
    pgm.dropConstraint("layers", "layers_type_key");
    pgm.dropConstraint("layers", "layers_unit_key");
    pgm.dropConstraint("layers", "layers_url_key");
    pgm.dropConstraint("layers", "layers_workspace_key");
};
