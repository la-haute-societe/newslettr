var thru      = require('through2').obj,
    _defaults = require('lodash.defaults');

module.exports = function (opts) {
   return thru(transform, flush)

   function transform (obj, enc, callback) {
     this.push(_defaults(obj, opts))
     callback();
   }
   
   function flush (callback) { callback(); }
}


