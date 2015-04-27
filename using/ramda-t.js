var T = (function(R, Obj) {
    'use strict';

    var defined = R.complement(R.isNil);

    // http://clojuredocs.org/clojure.core/take-nth
    function take_nth(n, array) {
        return R.filterIndexed(function(_, index) {
            return index % n === 0;
        }, array);
    }

    // http://clojuredocs.org/clojure.core/concat
    function concat() {
        var var_args = Array.prototype.slice.call(arguments);
//         return R.reduce(R.concat, [], R.filter(defined, var_args));
        return R.reduce(R.concat, [], R.reject(R.isNil, var_args));
    }

    // http://clojuredocs.org/clojure.core/repeat
    function repeat(a, n) {
        var as = [];
        for (var i = 1; i <= n; i++) {
            var copy = Obj.copy({ a: a });
            as.push(copy.a);
        }
        return as;
    }

    // http://clojuredocs.org/clojure.core/partition
    // (partition n coll) (partition n step coll) (partition n step pad coll)
    // doesn't curry
    function partition() {
        var args_len = arguments.length;
        var n, step, pad, coll;

        if (args_len === 2) {
            n    = arguments[0];
            coll = arguments[1];
            step = n;
            pad  = undefined;
        }
        else if (args_len === 3) {
            n    = arguments[0];
            step = arguments[1];
            coll = arguments[2];
            pad  = undefined;
        }
        else if (args_len === 4) {
            n    = arguments[0];
            step = arguments[1];
            pad  = arguments[2];
            coll = arguments[3];
        }
        else {
            throw "partition takes: 2, 3 or 4 positional arguments: " 
                + arguments.length + " given";
        }

        var result = [];
        var coll_len = coll.length;

        var i = 0;
        while (i + n <= coll_len) {
            result.push(coll.slice(i, i + n));
            i += step;
        }

        if (i < coll_len && Array.isArray(pad)) {
            var rest_plus_pad = [];
            rest_plus_pad.push.apply(rest_plus_pad, coll.slice(i, coll_len));
            rest_plus_pad.push.apply(rest_plus_pad, pad);

//             i = 0;
//             var rest_plus_pad_len = rest_plus_pad.length;
//             while (i + n <= rest_plus_pad_len) {
//                 result.push(rest_plus_pad.slice(i, i + n));
//                 i += step;
//             }

            result.push(rest_plus_pad.slice(0, n));
        }

        return result;
    }

    return {
        defined:  defined,
        take_nth: take_nth,
        concat:   concat,
        repeat:   repeat,
        partition: partition,
    };
}(R, Obj));