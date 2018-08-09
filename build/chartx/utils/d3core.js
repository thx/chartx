define(
    "chartx/utils/d3core",
    [],
    function(){

        var d3core = {
            class : function(ctor, properties) {
                for (var key in properties) {
                    Object.defineProperty(ctor.prototype, key, {
                        value: properties[key],
                        enumerable: false
                    });
                }
            },
            map : function(object, f) {
                var map = new d3_Map;
                if (object instanceof d3_Map) {
                    object.forEach(function(key, value) { map.set(key, value); });
                } else if (Array.isArray(object)) {
                    var i = -1,
                        n = object.length,
                          o;
                    if (arguments.length === 1) while (++i < n) map.set(i, object[i]);
                    else while (++i < n) map.set(f.call(object, o = object[i], i), o);
                } else {
                    for (var key in object) map.set(key, object[key]);
                }
                return map;
            },
            interpolateNumber : function(a,b){
                a = +a, b = +b;
                return function(t) { return a * (1 - t) + b * t; };
            },
            nest : function() {
                var nest = {},
                keys = [],
                sortKeys = [],
                sortValues,
                rollup;

                function map(mapType, array, depth) {
                    if (depth >= keys.length) return rollup
                        ? rollup.call(nest, array) : (sortValues
                                ? array.sort(sortValues)
                                : array);

                    var i = -1,
                        n = array.length,
                        key = keys[depth++],
                        keyValue,
                        object,
                        setter,
                        valuesByKey = new d3_Map,
                        values;

                    while (++i < n) {
                        if (values = valuesByKey.get(keyValue = key(object = array[i]))) {
                            values.push(object);
                        } else {
                            valuesByKey.set(keyValue, [object]);
                        }
                    }

                    if (mapType) {
                        object = mapType();
                        setter = function(keyValue, values) {
                            object.set(keyValue, map(mapType, values, depth));
                        };
                    } else {
                        object = {};
                        setter = function(keyValue, values) {
                            object[keyValue] = map(mapType, values, depth);
                        };
                    }

                    valuesByKey.forEach(setter);
                    return object;
                }

                function entries(map, depth) {
                    if (depth >= keys.length) return map;

                    var array = [],
                        sortKey = sortKeys[depth++];

                    map.forEach(function(key, keyMap) {
                        array.push({key: key, values: entries(keyMap, depth)});
                    });

                    return sortKey
                        ? array.sort(function(a, b) { return sortKey(a.key, b.key); })
                        : array;
                }

                nest.map = function(array, mapType) {
                    return map(mapType, array, 0);
                };

                nest.entries = function(array) {
                    return entries(map(d3.map, array, 0), 0);
                };

                nest.key = function(d) {
                    keys.push(d);
                    return nest;
                };

                // Specifies the order for the most-recently specified key.
                // Note: only applies to entries. Map keys are unordered!
                nest.sortKeys = function(order) {
                    sortKeys[keys.length - 1] = order;
                    return nest;
                };

                // Specifies the order for leaf values.
                // Applies to both maps and entries array.
                nest.sortValues = function(order) {
                    sortValues = order;
                    return nest;
                };

                nest.rollup = function(f) {
                    rollup = f;
                    return nest;
                };

                return nest;
            }
        };


        /*d3 map的core代码*/
        function d3_Map() {
            this._ = Object.create(null);
        };

        var d3_map_proto = "__proto__", d3_map_zero = "\0";

        d3core.class(d3_Map, {
            has: d3_map_has,
            get: function(key) {
                return this._[d3_map_escape(key)];
            },
            set: function(key, value) {
                return this._[d3_map_escape(key)] = value;
            },
            remove: d3_map_remove,
            keys: d3_map_keys,
            values: function() {
                var values = [];
                for (var key in this._) values.push(this._[key]);
                return values;
            },
            entries: function() {
                var entries = [];
                for (var key in this._) entries.push({key: d3_map_unescape(key), value: this._[key]});
                return entries;
            },
            size: d3_map_size,
            empty: d3_map_empty,
            forEach: function(f) {
                for (var key in this._) f.call(this, d3_map_unescape(key), this._[key]);
            }
        });

        function d3_map_escape(key) {
            return (key += "") === d3_map_proto || key[0] === d3_map_zero ? d3_map_zero + key : key;
        };
        function d3_map_unescape(key) {
            return (key += "")[0] === d3_map_zero ? key.slice(1) : key;
        };
        function d3_map_has(key) {
            return d3_map_escape(key) in this._;
        };
        function d3_map_remove(key) {
            return (key = d3_map_escape(key)) in this._ && delete this._[key];
        };
        function d3_map_keys() {
            var keys = [];
            for (var key in this._) keys.push(d3_map_unescape(key));
            return keys;
        };
        function d3_map_size() {
            var size = 0;
            for (var key in this._) ++size;
            return size;
        };
        function d3_map_empty() {
            for (var key in this._) return false;
            return true;
        };
        /*d3 map的core代码 end*/


        return d3core;
        
    }
);
