'use strict';

(function(_) {

    var keywords = {
        'autoProperty' : /^\$(\w+)$/,
        'autoObjProperty' : /^\$\$(\w+)$/,
        'privateProperty' : /^__(\w+)__$/,
        'super' : /^_super$/,
        'self' : /^self$/,
        'constructor' : /^constructor$/,
        'extends' : /^extends$/
    };

    // annotate function borrowed from angularjs
    // (returns argument names)
    var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
    var FN_ARG_SPLIT = /,/;
    var FN_ARG = /^\s*(_?)(.+?)\1\s*$/;
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

    function annotate(fn) {
        var $inject,
            fnText,
            argDecl,
            last;

        if (typeof fn === 'function') {
            if (!($inject = fn.$inject)) {
                $inject = [];
                fnText = fn.toString().replace(STRIP_COMMENTS, '');
                argDecl = fnText.match(FN_ARGS);
                _.each(argDecl[1].split(FN_ARG_SPLIT), function(arg) {
                    arg.replace(FN_ARG, function(all, underscore, name) {
                        $inject.push(name);
                    });
                });
            }
        }
        return $inject;
    }

    _.mixin({
        class : function() {
            var _parent;
            var definition;

            if( _(arguments[0]).isFunction() ){
                _parent = arguments[0];
                definition = arguments[1];
            } else {
                definition = arguments[0];
            }

            //class constructor
            function _class() {
                if( _.isUndefined( definition.initialize)){
                    return;
                }

                var autoProperties = annotate(definition.initialize);
                var _arguments = arguments;
                var that = this;

                // self and super are not properties
                autoProperties = _.reject(autoProperties, function(property){
                    return property.match(keywords.self) || property.match(keywords.super);
                });

                _.each(autoProperties, function(property, index) {
                    var match;
                    match = property.match(keywords.autoProperty);
                    if ( match ) {
                        that[match[1]] = _arguments[index];
                    }

                    match = property.match(keywords.autoObjProperty);
                    if ( match && _.isObject(_arguments[index])) {
                        _.extend(that, _arguments[index]);
                    }
                });

                this.initialize.apply(this, arguments);
            };

            // Set up prototype chain
            _class.prototype.constructor = _class;
            function _subclass() {};
            if ( _parent ) {
                _subclass.prototype = _parent.prototype;
                _class.prototype = new _subclass;
            }

            var methodNames = _.chain(definition)
                               .keys()
                               .filter( function(method){
                                   return _.isFunction(definition[method]);
                               })
                               .value();

            // Wrap methods when there is an argument called self or base ( or both of them )
            // injecting the specified values.
            _.each(methodNames, function(method) {
                var argNames = annotate(definition[method]);

                if( argNames.length === 0 ){
                    //no arguments, don't wrap method
                    _class.prototype[method] = definition[method];
                } else {
                    //TODO: refactor this shit
                    if( argNames.length >= 2 && argNames[0].match(keywords.self) && argNames[1].match(keywords.super) ){
                        // "self", "super" as first and second argument
                        _class.prototype[method] = function(){
                            var args = _.toArray(arguments);
                            var _super = _parent.prototype[method].bind(this);
                            args.unshift(this, _super);
                            return _class.prototype[method].fn.apply(this, args);
                        };
                    } else if( argNames[0].match(keywords.self) ) {
                        // "self" as first argument
                        _class.prototype[method] = function(){
                            var args = _.toArray(arguments);
                            args.unshift(this);
                            return _class.prototype[method].fn.apply(this, args);
                        };
                    } else if( argNames[0].match(keywords.super) ) {
                        // "super" as first argument
                        _class.prototype[method] = function(){
                            var args = _.toArray(arguments);
                            var _super = _parent.prototype[method].bind(this);
                            args.unshift(_super);
                            return _class.prototype[method].fn.apply(this, args);
                        };
                    } else {
                        // no keywords matched, don't wrap function
                        _class.prototype[method] = definition[method];
                    }
                }
                //store the original unwrapped method 
                _class.prototype[method].fn = definition[method];
            });

            return _class;
        }
    });

})(_);
