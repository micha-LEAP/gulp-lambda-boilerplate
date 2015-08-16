var vendors = [ 'react' ];
var uglyOptions = {
  mangle: true,
  compress: {
    sequences: true,
    dead_code: true,
    conditionals: true,
    booleans: true,
    unused: true,
    if_return: true,
    join_vars: true,
    drop_console: true
  }
};

exports.vendors = vendors;
exports.uglyOptions = uglyOptions;
