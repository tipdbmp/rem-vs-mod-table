var Dom = (function() {
    function node_apply_style(dom_node, style) {
        var props = Object.keys(style);
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];
            dom_node.style[prop] = style[prop];
        }
    }

    // function root_node_apply_style(root_node, style) {
    //     var props = Object.keys(style);
    //     for (var i = 0; i < props.length; i++) {
    //         var prop = props[i];
    //         if (prop.substr(0, 1) === '$') {
    //             var sub_node_name = prop.substr(0);
    //             if (root_node[sub_node_name].length) {
    //                 var arrayish = root_node[sub_node_name];
    //                 for (var j = 0; j < arrayish.length; j++) {
    //                     root_node_apply_style(arrayish[j], style[prop]);
    //                 }
    //             }
    //             else {
    //                 root_node_apply_style(
    //                     root_node[sub_node_name],
    //                     style[prop]
    //                 );
    //             }
    //         }
    //         else {
    //             root_node.style[prop] = style[prop];
    //         }
    //     }
    // }

    function node_apply_values($node, values) {
        var keys = Object.keys(values);
        for (
            var key_index = 0;
            key_index < keys.length;
            key_index
        ) {
            var key = keys[key_index];
            var value = values[key];
            $node[key] = value;
        }
    }

    // var nodes
    //     = (a_ instanceof Array) ? a_
    //     :                         Array.prototype.slice.call(arguments, 1)
    //     ;
    function node_push(node) {
        for (var i = 1; i < arguments.length; i++) {
            // auto-convert strings to Text nodes
            if (typeof arguments[i] === 'string') {
                arguments[i] = new Text(arguments[i]);
                node.appendChild(arguments[i]);
            }
            else if (arguments[i] instanceof Array) {
                var array = arguments[i];
                for (var j = 0; j < array.length; j++) {
                    node_push(node, array[j]);
                }
            }
            else {
                node.appendChild(arguments[i]);
            }
        }
    }

    function node_unshift(node) {
        var fc = node.firstElementChild;
        function _node_unshift() {
            for (var i = 0; i < arguments.length; i++) {
                // auto-convert strings to Text nodes
                if (typeof arguments[i] === 'string') {
                    arguments[i] = new Text(arguments[i]);
                    arguments[i].parentNode = node;
                    node.insertBefore(arguments[i], fc);
                }
                else if (arguments[i] instanceof Array) {
                    var array = arguments[i];
                    for (var j = 0; j < array.length; j++) {
                        _node_unshift(array[j]);
                    }
                }
                else {
                    arguments[i].parentNode = node;
                    node.insertBefore(arguments[i], fc);
                }
            }
        }
        _node_unshift.apply(null, Array.prototype.slice.call(arguments, 1));
    }

    function node_remove_all_children(node) {
        while (node.firstChild) { node.removeChild(node.firstChild); }
    }

    function clear_node() {
//         .clear { clear: both; display: block; margin: 0; padding: 0; }
        var clear = document.createElement('span');
//         clear.style.background = 'yellow';
//         clear.textContent = 'foo';
        clear.style.clear = 'both';
        clear.style.display = 'block';
//         clear.style.margin = 0;
//         clear.style.padding = 0;
        return clear;
    }

    function node_builder_with(args) {
        var tag    = args.tag;
        var style  = args.style  || {};
        var values = args.values || {};

        return function node_builder(text_content) {
            var $node = document.createElement(tag);
            node_apply_style($node, style);
            node_apply_values($node, values);
            $node.textContent = text_content;

            node_push($node, Array.prototype.slice.call(arguments, 1));

            return $node;
        }
    }

    return {
        node_apply_style: node_apply_style,
        // root_node_apply_style: root_node_apply_style,

        node_apply_values: node_apply_values,

        node_push: node_push,
        node_unshift: node_unshift,
        node_remove_all_children: node_remove_all_children,

        clear_node: clear_node,

        node_builder_with: node_builder_with,
    };
}());