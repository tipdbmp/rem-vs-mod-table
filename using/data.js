var Data = (function(window, Obj) {
    var _Object = window.Object;

    function Data(use, own_members) {
        var is_array = Array.isArray;

        if (!is_array(use)) {
            own_members = use;
            use = [];
        }

        return function () {
            var self = Obj.copy(own_members);

            // Given:
            // use = [
            //     'entitiy', Entity,
            //     'widget', Widget
            // ];

            // If we walk 'use' forward (0 .. use.length - 1)
            // then the proto/lookup chain would be:
            //     self -> Widget-> Entitiy

            // for (var i = 0; i < use.length; i += 2) {
            //     var use_name = use[i];
            //     var use_constructor = use [i + 1];

            // but if we walk 'use' backwards (use.length - 1 ... 0)
            // it would be:
            //     self -> Entity -> Widget

            // I.e if there a lot of lookups for the Entity's members
            // it is probably better to walk backwards:

            for (var i = use.length - 1; i > 0; i -= 2) {
                var use_name = use[i - 1];
                var use_constructor = use [i];

                self[use_name] = use_constructor();

                var proto = self.__proto__;
                self.__proto__ = self[use_name];

                if (self[use_name].__proto__ === _Object.prototype) {
                    self[use_name].__proto__ = proto;
                }
            }

            return self;
        };
    }

    return Data;
}(window, Obj));