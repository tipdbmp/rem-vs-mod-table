var Obj = (function() {

    // from AngularJS's source

    function isObject(value) {
      // http://jsperf.com/isobject4
      return value !== null && typeof value === 'object';
    }
    var isArray = Array.isArray;
    function isFunction(value) {return typeof value === 'function';}

    var slice = [].slice;

    function baseExtend(dst, objs, deep) {
      for (var i = 0, ii = objs.length; i < ii; ++i) {
        var obj = objs[i];
        if (!isObject(obj) && !isFunction(obj)) continue;
        var keys = Object.keys(obj);
        for (var j = 0, jj = keys.length; j < jj; j++) {
          var key = keys[j];
          var src = obj[key];

          if (deep && isObject(src)) {
            if (!isObject(dst[key])) dst[key] = isArray(src) ? [] : {};
            baseExtend(dst[key], [src], true);
          } else {
            dst[key] = src;
          }
        }
      }
      return dst;
    }


    /**
     * @ngdoc function
     * @name angular.extend
     * @module ng
     * @kind function
     *
     * @description
     * Extends the destination object `dst` by copying own enumerable properties from the `src` object(s)
     * to `dst`. You can specify multiple `src` objects. If you want to preserve original objects, you can do so
     * by passing an empty object as the target: `var object = angular.extend({}, object1, object2)`.
     *
     * **Note:** Keep in mind that `angular.extend` does not support recursive merge (deep copy). Use
     * {@link angular.merge} for this.
     *
     * @param {Object} dst Destination object.
     * @param {...Object} src Source object(s).
     * @returns {Object} Reference to `dst`.
     */
    function extend(dst) {
      return baseExtend(dst, slice.call(arguments, 1), false);
    }


    /**
    * @ngdoc function
    * @name angular.merge
    * @module ng
    * @kind function
    *
    * @description
    * Deeply extends the destination object `dst` by copying own enumerable properties from the `src` object(s)
    * to `dst`. You can specify multiple `src` objects. If you want to preserve original objects, you can do so
    * by passing an empty object as the target: `var object = angular.merge({}, object1, object2)`.
    *
    * Unlike {@link angular.extend extend()}, `merge()` recursively descends into object properties of source
    * objects, performing a deep copy.
    *
    * @param {Object} dst Destination object.
    * @param {...Object} src Source object(s).
    * @returns {Object} Reference to `dst`.
    */
    function merge(dst) {
      return baseExtend(dst, slice.call(arguments, 1), true);
    }

    function copy(obj) {
        return merge({}, obj);
    }

    return {
        merge: merge,
        extend: extend,
        copy: copy,
    };
}());