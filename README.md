Underclass: a class mixin for underscore 
========================================

Underclass is a mixin for Underscore that provides some syntactic sugar for declaring classes in JavaScript.
It borrows some ideas from CoffeeScript, Python, PrototypeJS, and AngularJS.

Basically, it takes a look at the name of the arguments of your class methods and does things for you.

So something like this:

```javascript
var Person = function (name, surname) {
    this.name = name;
    this.surname = surname;
};

Person.prototype.say = function (something) {
    alert(this.name + " " + this.surname + " says : " + something);
};

var Pirate = function (name, surname) {
    this.name = name;
    this.surname = surname;
};

Pirate.prototype = new Person();

Pirate.prototype.say = function(something){
    Person.prototype.say.apply(this, arguments);
    alert("... YIARR!!");
}
```

Turns into something like this:

```javascript

var Person = _.class({
    initialize: function($name, $surname){},
    say: function(){
        alert(this.name + " " + this.surname + " says : " + something);
    }
});

var Pirate = _.class(Person, {
    initialize: function($name, $surname){},
    say: function(_super, something){
        _super(something);
        alert("... YIARR!!");
    }
});
```

Defining classes
----------------

**class** _.class([baseClass,] definition)

* **baseClass:** Class to inherit from.
* **definition:** An object containing the class methods. Class constructor can be specified in the 'initialize' key.


Special arguments in class constructor
--------------------------------------

**Auto-properties: arguments beginning with `$`**

Every argument in a class constructor that begins with a `$` is automatically asigned to the class instance upon initialization.

```javascript
var Person = _.class({
    constructor: function($name, $surname){
        /*
            no need to do this:

            this.name = name;
            this.surname = surname;
       */
    }
});

var morgan = new Person("Morgan", "Freeman");

console.log(morgan.name, morgan.surname) // --> 'Morgan', 'Freeman'
```

**Object auto-properties: arguments beginning with `$$` ( double dollar )**

An argument begininng with `$$` is assumed to be an object of properties, and each of its properties will be assigned to the class instance upon initialization.

This is useful when you have an object as a single argument instead of several ones, as this enhances readibilty when instantiating the object.

An example:

```javascript

var Rectangle = _.class({
    constructor: function($x, $y, $width, $height){}
});

var r = new Rectangle(200,150,50,75); // wat?
```

```javascript

var Rectangle = _.class({
    constructor: function($properties){}
});

var r = new Rectangle({
    x: 200,
    y: 150,
    width: 50,
    height: 75
});
```

Special arguments in methods
----------------------------

There are two special arguments when defining methods: `self` and `_super`. Underclass will look for them and make stuff available for you through this special arguments, but wraps the exposed method in a function so you don't have to care about them when calling methods.

This special arguments have to be placed at the beginning of your method definition. These combinations are possible:

```javascript
    function(self, ...){ ... }
    function(self, _super, ...){ ... }
    function(_super, ...){ ... }
```

**`_super` argument** 

If you override one of its superclass's methods, you can invoke the overridden method through argument `_super`.

```javascript

var Person = _.class({
    initialize: function($name, $surname){},
    says: function(){
        alert(this.name + " " + this.surname + " says : " + something);
    }
});

var Pirate = _.class({
    initialize: function($name, $surname){},
    say: function(_super, something){
        //_super is a reference to Person#say
        _super(something);
        alert("... YIARR!!");
    }
});
```

**`self` argument**

`self` is a reference to the class instance. Using `self` instead of `this` prevents you from having to type the infamous `var that = this`, binding functions, and other stuff.

```javascript

var Person = _.class({
    initialize: function($name, $surname){},
    say: function(){
        alert(this.name + " " + this.surname + " says : " + something);
    },
    repeat: function(self, n, something){
        _(n).times(function(){
            self.say(something);
        });
    }
});

var repetitiveGuy = new Person("Jimmy", "McPerson");
repetitiveGuy.repeat(10, "Hey man!");
```

Inspiration ( borrowed/shamelessly stolen ideas )
-------------------------------------------------

* http://www.coffeescript.org: automatically setting properties in constructor.
* http://www.python.org: self as first parameter in all methods ( is a pain in the ass in Python, but can be useful here =D )
* http://www.angularjs.org: the whole argument inspection thing.
* http://www.prototypejs.org: the way inheritance is defined.
